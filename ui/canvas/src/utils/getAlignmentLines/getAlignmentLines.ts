import { CanvasAlignmentAxis, CanvasNodeFrame } from '../../types';

/**
 * Returns a frame's alignment lines on an axis: its leading edge,
 * center and trailing edge.
 *
 * @param frame - The frame in canvas coordinates.
 * @param axis - The axis to get the lines on.
 * @returns The alignment line coordinates.
 */
export function getAlignmentLines(
  frame: CanvasNodeFrame,
  axis: CanvasAlignmentAxis,
): number[] {
  const start = axis === 'x' ? frame.x : frame.y;
  const size = axis === 'x' ? frame.width : frame.height;

  return [start, start + size / 2, start + size];
}
