import { ALIGNMENT_TOLERANCE } from '../../constants';
import {
  CanvasAlignmentAxis,
  CanvasAlignmentGuide,
  CanvasNodeFrame,
} from '../../types';
import { getAlignmentLines } from '../getAlignmentLines';
import { CanvasSpan, getGuideSpan } from '../getGuideSpan';

/**
 * A resized edge snapped to the nodes it aligns with, and the
 * guide showing the alignment.
 */
export interface EdgeSnapResult {
  /**
   * The snapped edge coordinate.
   */
  position: number;

  /**
   * The guide between the snapped edge and the frames it aligns
   * with, or null when the edge is not aligned.
   */
  guide: CanvasAlignmentGuide | null;
}

/**
 * Snaps a single moving edge to the nearest alignment line (edge
 * or center) of other frames on an axis.
 *
 * @param edge - The edge's coordinate on the axis.
 * @param span - The moving frame's extent along the guides.
 * @param targets - The frames to align to, in canvas coordinates.
 * @param threshold - The maximum snapping distance in canvas units.
 * @param axis - The axis the edge moves along.
 * @returns The snapped edge and the guide it aligns along.
 */
export function getEdgeSnap(
  edge: number,
  span: CanvasSpan,
  targets: CanvasNodeFrame[],
  threshold: number,
  axis: CanvasAlignmentAxis,
): EdgeSnapResult {
  // The nearest alignment line found so far
  let position = edge;
  let distance = Infinity;

  targets.forEach((target) => {
    getAlignmentLines(target, axis).forEach((line) => {
      const lineDistance = Math.abs(line - edge);

      // Too far to snap to
      if (lineDistance > threshold) {
        return;
      }

      // Keep the nearest alignment line
      if (lineDistance < distance) {
        position = line;
        distance = lineDistance;
      }
    });
  });

  // The edge is not near any alignment line
  if (distance === Infinity) {
    return { position, guide: null };
  }

  const guide: CanvasAlignmentGuide = {
    axis,
    position,
    start: span.start,
    end: span.end,
  };

  // Extend the guide over every frame sharing the snapped line
  targets.forEach((target) => {
    const aligned = getAlignmentLines(target, axis).some(
      (line) => Math.abs(line - position) < ALIGNMENT_TOLERANCE,
    );

    if (!aligned) {
      return;
    }

    const targetSpan = getGuideSpan(target, axis);

    guide.start = Math.min(guide.start, targetSpan.start);
    guide.end = Math.max(guide.end, targetSpan.end);
  });

  return { position, guide };
}
