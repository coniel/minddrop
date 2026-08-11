import { CanvasAlignmentAxis, CanvasNodeResizeEdge } from '../../types';

/**
 * Returns whether a resize from the given edge moves the node's
 * edges along an axis.
 *
 * @param edge - The edge or corner being dragged.
 * @param axis - The axis to check.
 * @returns Whether the resize moves along the axis.
 */
export function resizeMovesAxis(
  edge: CanvasNodeResizeEdge,
  axis: CanvasAlignmentAxis,
): boolean {
  // Horizontal moves come from the side edges and the corners
  if (axis === 'x') {
    return edge.endsWith('left') || edge.endsWith('right');
  }

  return edge.startsWith('top') || edge.startsWith('bottom');
}
