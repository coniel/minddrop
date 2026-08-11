import {
  CanvasAlignmentGuide,
  CanvasNodeFrame,
  CanvasNodeResizeState,
  CanvasPoint,
} from '../../types';
import { getEdgeSnap } from '../getEdgeSnap';
import { getGuideSpan } from '../getGuideSpan';
import { getResizeAnchors } from '../getResizeAnchors';
import { getResizeGuideFrame } from '../getResizeGuideFrame';
import { resizeMovesAxis } from '../resizeMovesAxis';
import { snapToGrid } from '../snapToGrid';

/**
 * The distances a resize's moving edges travel once snapped, and
 * the guides showing the alignments they snapped to.
 */
export interface SnappedResizeDeltas {
  /**
   * The snapped horizontal distance.
   */
  x: number;

  /**
   * The snapped vertical distance.
   */
  y: number;

  /**
   * The guides for the alignments the edges snapped to, empty
   * when they align with nothing.
   */
  guides: CanvasAlignmentGuide[];
}

export interface GetSnappedResizeDeltasOptions {
  /**
   * Whether the moving edges land on the grid.
   */
  grid: boolean;

  /**
   * Whether the moving edges align to the other nodes' edges and
   * centers.
   */
  objects: boolean;

  /**
   * The frames to align to, in canvas coordinates.
   */
  targets: CanvasNodeFrame[];

  /**
   * The maximum aligning distance in canvas units.
   */
  threshold: number;

  /**
   * Whether the resize mirrors around the node's center, which
   * widens the span its guides cover.
   */
  mirror: boolean;
}

/**
 * Snaps the distance a resize's moving edges travel to the grid
 * and to the other nodes they align with. Aligning to the other
 * nodes takes over from the grid where they align, so the two
 * settings combine.
 *
 * @param state - The in-progress resize.
 * @param delta - The distance the pointer travelled, in canvas units.
 * @param options - Which snapping applies, and what to align to.
 * @returns The snapped distances and their alignment guides.
 */
export function getSnappedResizeDeltas(
  state: CanvasNodeResizeState,
  delta: CanvasPoint,
  options: GetSnappedResizeDeltasOptions,
): SnappedResizeDeltas {
  const { grid, objects, targets, threshold, mirror } = options;

  // The edges the resize moves, which snapping aligns
  const anchors = getResizeAnchors(state);

  // Shift the deltas so the moving edges land on grid lines
  const gridDeltaX = grid
    ? snapToGrid(anchors.x + delta.x) - anchors.x
    : delta.x;
  const gridDeltaY = grid
    ? snapToGrid(anchors.y + delta.y) - anchors.y
    : delta.y;

  // The frame the resize projects to, whose extents the guides
  // span
  const projected = getResizeGuideFrame(state, gridDeltaX, gridDeltaY, mirror);

  // Snap each moving edge to the other nodes' edges and centers
  const edgeSnapX =
    objects && resizeMovesAxis(state.edge, 'x')
      ? getEdgeSnap(
          anchors.x + gridDeltaX,
          getGuideSpan(projected, 'x'),
          targets,
          threshold,
          'x',
        )
      : null;
  const edgeSnapY =
    objects && resizeMovesAxis(state.edge, 'y')
      ? getEdgeSnap(
          anchors.y + gridDeltaY,
          getGuideSpan(projected, 'y'),
          targets,
          threshold,
          'y',
        )
      : null;

  // Guides for the axes which landed on an alignment
  const guides: CanvasAlignmentGuide[] = [];

  if (edgeSnapX?.guide) {
    guides.push(edgeSnapX.guide);
  }

  if (edgeSnapY?.guide) {
    guides.push(edgeSnapY.guide);
  }

  return {
    x: edgeSnapX ? edgeSnapX.position - anchors.x : gridDeltaX,
    y: edgeSnapY ? edgeSnapY.position - anchors.y : gridDeltaY,
    guides,
  };
}
