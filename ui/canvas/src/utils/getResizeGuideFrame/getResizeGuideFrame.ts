import { CanvasNodeFrame, CanvasNodeResizeState } from '../../types';
import { getResizeAnchors } from '../getResizeAnchors';
import { resizeMovesAxis } from '../resizeMovesAxis';

/**
 * Returns the frame a resize projects to for the given deltas,
 * used to span the alignment guides over the resized node. The
 * frame ignores size limits and workspace bounds, since the
 * guides only need the extents the moving edges reach for.
 *
 * @param state - The in-progress resize.
 * @param deltaX - The horizontal distance the moving edge travelled.
 * @param deltaY - The vertical distance the moving edge travelled.
 * @param mirror - Whether the resize mirrors around the node's center.
 * @returns The projected frame in canvas coordinates.
 */
export function getResizeGuideFrame(
  state: CanvasNodeResizeState,
  deltaX: number,
  deltaY: number,
  mirror: boolean,
): CanvasNodeFrame {
  const { originX, originY, originWidth, originHeight } = state;
  const anchors = getResizeAnchors(state);

  // The edges the resize leaves in place, which mirrored resizes
  // move in the opposite direction
  const oppositeX = state.edge.endsWith('left')
    ? originX + originWidth
    : originX;
  const oppositeY = state.edge.startsWith('top')
    ? originY + originHeight
    : originY;

  // The horizontal extent, unchanged when the resize does not
  // move along the axis
  const horizontal = resizeMovesAxis(state.edge, 'x')
    ? getExtent(anchors.x + deltaX, mirror ? oppositeX - deltaX : oppositeX)
    : { start: originX, end: originX + originWidth };

  // The vertical extent
  const vertical = resizeMovesAxis(state.edge, 'y')
    ? getExtent(anchors.y + deltaY, mirror ? oppositeY - deltaY : oppositeY)
    : { start: originY, end: originY + originHeight };

  return {
    x: horizontal.start,
    y: vertical.start,
    width: horizontal.end - horizontal.start,
    height: vertical.end - vertical.start,
  };
}

/**
 * Returns the extent between two edge coordinates, in order.
 */
function getExtent(
  edge: number,
  opposite: number,
): { start: number; end: number } {
  return {
    start: Math.min(edge, opposite),
    end: Math.max(edge, opposite),
  };
}
