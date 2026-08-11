import { CanvasNodeResizeState, CanvasPoint } from '../../types';

/**
 * Returns the canvas coordinates of the node edges a resize
 * moves, which snapping aligns to the grid.
 *
 * @param state - The in-progress resize.
 * @returns The moving edges' coordinates on each axis.
 */
export function getResizeAnchors(state: CanvasNodeResizeState): CanvasPoint {
  // Edges dragged from the left move the node's left edge, all
  // others its right edge
  const x = state.edge.endsWith('left')
    ? state.originX
    : state.originX + state.originWidth;

  // Edges dragged from the top move the node's top edge, all
  // others its bottom edge
  const y = state.edge.startsWith('top')
    ? state.originY
    : state.originY + state.originHeight;

  return { x, y };
}
