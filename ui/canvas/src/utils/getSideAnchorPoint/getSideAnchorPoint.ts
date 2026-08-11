import { CanvasNodeFrame, CanvasNodeSide, CanvasPoint } from '../../types';
import { getSideMidpoint } from '../getSideMidpoint';

/**
 * Returns the point a connection end anchors to on a node
 * frame's side: the side's midpoint, or the point at the given
 * offset from the side's start corner (the top corner for
 * left/right sides, the left corner for top/bottom sides),
 * clamped to the side's length.
 *
 * @param frame - The node frame.
 * @param side - The side the anchor sits on.
 * @param offset - The anchor's distance from the side's start corner.
 * @returns The anchor point.
 */
export function getSideAnchorPoint(
  frame: CanvasNodeFrame,
  side: CanvasNodeSide,
  offset?: number,
): CanvasPoint {
  // Anchor at the side's midpoint when no offset is given
  if (offset === undefined) {
    return getSideMidpoint(frame, side);
  }

  if (side === 'left') {
    return { x: frame.x, y: frame.y + clampOffset(offset, frame.height) };
  }

  if (side === 'right') {
    return {
      x: frame.x + frame.width,
      y: frame.y + clampOffset(offset, frame.height),
    };
  }

  if (side === 'top') {
    return { x: frame.x + clampOffset(offset, frame.width), y: frame.y };
  }

  return {
    x: frame.x + clampOffset(offset, frame.width),
    y: frame.y + frame.height,
  };
}

/**
 * Clamps an anchor offset to a side's length.
 */
function clampOffset(offset: number, length: number): number {
  return Math.max(0, Math.min(offset, length));
}
