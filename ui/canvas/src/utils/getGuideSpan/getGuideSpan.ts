import { CanvasAlignmentAxis, CanvasNodeFrame } from '../../types';

/**
 * A frame's extent along an axis.
 */
export interface CanvasSpan {
  /**
   * The extent's start coordinate.
   */
  start: number;

  /**
   * The extent's end coordinate.
   */
  end: number;
}

/**
 * Returns a frame's extent on the axis perpendicular to the given
 * one, which is the axis that axis's guides run along.
 *
 * @param frame - The frame in canvas coordinates.
 * @param axis - The axis the guides align nodes along.
 * @returns The frame's extent along the guides.
 */
export function getGuideSpan(
  frame: CanvasNodeFrame,
  axis: CanvasAlignmentAxis,
): CanvasSpan {
  const start = axis === 'x' ? frame.y : frame.x;
  const size = axis === 'x' ? frame.height : frame.width;

  return { start, end: start + size };
}
