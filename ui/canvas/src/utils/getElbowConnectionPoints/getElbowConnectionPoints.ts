import { CONNECTION_ELBOW_STUB } from '../../constants';
import {
  CanvasConnectionAnchor,
  CanvasNodeFrame,
  CanvasNodeSide,
  CanvasPoint,
} from '../../types';
import { getSideNormal } from '../getSideNormal';

/**
 * Returns the corner points of an axis-aligned connection route
 * between two anchors, using the fewest segments the connected
 * sides and node positions allow. Parallel runs split as close to
 * halfway as possible, and routes that would cross an endpoint
 * node detour around it through the nearest clear channel.
 *
 * @param from - The connection's source anchor.
 * @param to - The connection's target anchor.
 * @returns The route's points, including both anchor points.
 */
export function getElbowConnectionPoints(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
): CanvasPoint[] {
  const fromNormal = getSideNormal(from.side);
  const toNormal = getSideNormal(to.side);
  const fromHorizontal = isHorizontalSide(from.side);
  const toHorizontal = isHorizontalSide(to.side);

  let points: CanvasPoint[];

  if (fromHorizontal !== toHorizontal) {
    // Perpendicular sides bend between the two axes
    points = getPerpendicularPoints(from, to, fromNormal, toNormal);
  } else if (toNormal.x === -fromNormal.x && toNormal.y === -fromNormal.y) {
    // Sides facing each other join with a stepped route
    points = getFacingPoints(from, to, fromNormal, toNormal);
  } else {
    // Sides facing the same way loop around the outside
    points = getSameFacingPoints(from, to, fromNormal);
  }

  return simplifyPoints(points);
}

/**
 * Routes anchors on perpendicular axes: a single corner when the
 * target lies ahead of the exit and the approach clears its side,
 * otherwise a detour through the target's stub point.
 */
function getPerpendicularPoints(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
  fromNormal: CanvasPoint,
  toNormal: CanvasPoint,
): CanvasPoint[] {
  const stub = CONNECTION_ELBOW_STUB;
  const fromHorizontal = isHorizontalSide(from.side);

  // Single corner: exit axis first, then straight into the target
  const corner: CanvasPoint = fromHorizontal
    ? { x: to.point.x, y: from.point.y }
    : { x: from.point.x, y: to.point.y };

  // The corner is valid when both legs run their required way:
  // out of the exit side, and into the entry side
  const entryDirection = scale(toNormal, -1);
  const leg1 = subtract(corner, from.point);
  const leg2 = subtract(to.point, corner);

  if (dot(leg1, fromNormal) >= stub && dot(leg2, entryDirection) >= stub) {
    return [from.point, corner, to.point];
  }

  // Detour: cross over in the middle of the clear space between
  // the exit and the target frame, or around the target's far
  // side when there is no room between them
  const anchorCoord = dot(from.point, fromNormal);
  const [targetNear, targetFar] = frameInterval(anchorFrame(to), fromNormal);
  const crossing =
    targetNear - anchorCoord >= stub * 2
      ? (anchorCoord + targetNear) / 2
      : Math.max(targetFar + stub, anchorCoord + stub);

  const exitPoint = add(from.point, scale(fromNormal, crossing - anchorCoord));
  const entryPoint = add(to.point, scale(toNormal, stub));
  const detourCorner: CanvasPoint = fromHorizontal
    ? { x: exitPoint.x, y: entryPoint.y }
    : { x: entryPoint.x, y: exitPoint.y };

  return [from.point, exitPoint, detourCorner, entryPoint, to.point];
}

/**
 * Routes anchors on facing sides: a straight or stepped route
 * crossing over at the halfway line when the target lies ahead,
 * otherwise a loop around through a clear channel.
 */
function getFacingPoints(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
  fromNormal: CanvasPoint,
  toNormal: CanvasPoint,
): CanvasPoint[] {
  const fromHorizontal = isHorizontalSide(from.side);

  // Distance from the source anchor to the target along the exit
  // direction
  const forward = dot(subtract(to.point, from.point), fromNormal);

  // Too little room to step between the anchors
  if (forward < CONNECTION_ELBOW_STUB * 2) {
    return getChannelPoints(from, to, fromNormal, toNormal);
  }

  // Step across at the halfway line between the anchors
  const mid = add(from.point, scale(fromNormal, forward / 2));

  if (fromHorizontal) {
    return [
      from.point,
      { x: mid.x, y: from.point.y },
      { x: mid.x, y: to.point.y },
      to.point,
    ];
  }

  return [
    from.point,
    { x: from.point.x, y: mid.y },
    { x: to.point.x, y: mid.y },
    to.point,
  ];
}

/**
 * Routes anchors on sides facing the same way: a loop around the
 * outermost of the two sides, detouring through a clear channel
 * when the direct loop would cross an endpoint node.
 */
function getSameFacingPoints(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
  normal: CanvasPoint,
): CanvasPoint[] {
  const stub = CONNECTION_ELBOW_STUB;
  const fromHorizontal = isHorizontalSide(from.side);
  const stub1 = add(from.point, scale(normal, stub));
  const stub2 = add(to.point, scale(normal, stub));

  // The outermost stub coordinate along the shared direction
  const outDistance = Math.max(dot(stub1, normal), dot(stub2, normal));
  const out1: CanvasPoint = fromHorizontal
    ? { x: outDistance * normal.x, y: from.point.y }
    : { x: from.point.x, y: outDistance * normal.y };
  const out2: CanvasPoint = fromHorizontal
    ? { x: outDistance * normal.x, y: to.point.y }
    : { x: to.point.x, y: outDistance * normal.y };

  // The direct loop crosses an endpoint node
  if (
    segmentCrossesFrame(from.point, out1, anchorFrame(to)) ||
    segmentCrossesFrame(out2, to.point, anchorFrame(from))
  ) {
    return getChannelPoints(from, to, normal, normal);
  }

  return [from.point, out1, out2, to.point];
}

/**
 * Routes a loop between the anchors' stub points through a
 * channel perpendicular to the anchor axes: the gap between the
 * two frames when there is room, otherwise around the nearest
 * outer edge.
 */
function getChannelPoints(
  from: CanvasConnectionAnchor,
  to: CanvasConnectionAnchor,
  fromNormal: CanvasPoint,
  toNormal: CanvasPoint,
): CanvasPoint[] {
  const stub = CONNECTION_ELBOW_STUB;
  const fromHorizontal = isHorizontalSide(from.side);
  const stub1 = add(from.point, scale(fromNormal, stub));
  const stub2 = add(to.point, scale(toNormal, stub));
  const fromFrame = anchorFrame(from);
  const toFrame = anchorFrame(to);

  // The channel coordinate on the axis perpendicular to the sides
  const channel = fromHorizontal
    ? getChannelCoordinate(
        [fromFrame.y, fromFrame.y + fromFrame.height],
        [toFrame.y, toFrame.y + toFrame.height],
        (from.point.y + to.point.y) / 2,
      )
    : getChannelCoordinate(
        [fromFrame.x, fromFrame.x + fromFrame.width],
        [toFrame.x, toFrame.x + toFrame.width],
        (from.point.x + to.point.x) / 2,
      );

  // Turn onto the channel at each stub point
  const turn1: CanvasPoint = fromHorizontal
    ? { x: stub1.x, y: channel }
    : { x: channel, y: stub1.y };
  const turn2: CanvasPoint = fromHorizontal
    ? { x: stub2.x, y: channel }
    : { x: channel, y: stub2.y };

  return [from.point, stub1, turn1, turn2, stub2, to.point];
}

/**
 * Returns the channel coordinate between or around two frame
 * extents: the middle of the gap between them when there is room,
 * otherwise just past the outer edge nearest the preferred
 * coordinate.
 */
function getChannelCoordinate(
  a: [number, number],
  b: [number, number],
  preferred: number,
): number {
  const stub = CONNECTION_ELBOW_STUB;

  // Through the gap between the frames
  if (a[1] + stub <= b[0] - stub) {
    return (a[1] + b[0]) / 2;
  }

  if (b[1] + stub <= a[0] - stub) {
    return (b[1] + a[0]) / 2;
  }

  // No gap, go around the nearer outer edge
  const low = Math.min(a[0], b[0]) - stub;
  const high = Math.max(a[1], b[1]) + stub;

  return Math.abs(preferred - low) <= Math.abs(preferred - high) ? low : high;
}

/**
 * Returns a frame's extent along the axis of a side normal, as a
 * low/high coordinate pair in the normal's signed space.
 */
function frameInterval(
  frame: CanvasNodeFrame,
  normal: CanvasPoint,
): [number, number] {
  const a = dot({ x: frame.x, y: frame.y }, normal);
  const b = dot(
    { x: frame.x + frame.width, y: frame.y + frame.height },
    normal,
  );

  return [Math.min(a, b), Math.max(a, b)];
}

/**
 * Whether an axis-aligned segment passes through a frame's
 * interior.
 */
function segmentCrossesFrame(
  a: CanvasPoint,
  b: CanvasPoint,
  frame: CanvasNodeFrame,
): boolean {
  // Horizontal segment
  if (a.y === b.y) {
    return (
      a.y > frame.y &&
      a.y < frame.y + frame.height &&
      Math.max(a.x, b.x) > frame.x &&
      Math.min(a.x, b.x) < frame.x + frame.width
    );
  }

  // Vertical segment
  return (
    a.x > frame.x &&
    a.x < frame.x + frame.width &&
    Math.max(a.y, b.y) > frame.y &&
    Math.min(a.y, b.y) < frame.y + frame.height
  );
}

/**
 * Removes repeated points and merges collinear runs into single
 * segments.
 */
function simplifyPoints(points: CanvasPoint[]): CanvasPoint[] {
  const result: CanvasPoint[] = [];

  points.forEach((point) => {
    const previous = result[result.length - 1];

    // Drop repeated points
    if (previous && previous.x === point.x && previous.y === point.y) {
      return;
    }

    const beforePrevious = result[result.length - 2];

    // Merge collinear runs by replacing the middle point
    if (
      previous &&
      beforePrevious &&
      ((beforePrevious.x === previous.x && previous.x === point.x) ||
        (beforePrevious.y === previous.y && previous.y === point.y))
    ) {
      result[result.length - 1] = point;

      return;
    }

    result.push(point);
  });

  return result;
}

/**
 * Returns the anchor's node frame, treating frame-less anchors as
 * zero-size frames at the anchor point.
 */
function anchorFrame(anchor: CanvasConnectionAnchor): CanvasNodeFrame {
  return (
    anchor.frame ?? {
      x: anchor.point.x,
      y: anchor.point.y,
      width: 0,
      height: 0,
    }
  );
}

/**
 * Whether a side lies on the horizontal axis.
 */
function isHorizontalSide(side: CanvasNodeSide): boolean {
  return side === 'left' || side === 'right';
}

/**
 * Adds two points.
 */
function add(a: CanvasPoint, b: CanvasPoint): CanvasPoint {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Subtracts the second point from the first.
 */
function subtract(a: CanvasPoint, b: CanvasPoint): CanvasPoint {
  return { x: a.x - b.x, y: a.y - b.y };
}

/**
 * Scales a point by a factor.
 */
function scale(point: CanvasPoint, factor: number): CanvasPoint {
  return { x: point.x * factor, y: point.y * factor };
}

/**
 * Returns the dot product of two points.
 */
function dot(a: CanvasPoint, b: CanvasPoint): number {
  return a.x * b.x + a.y * b.y;
}
