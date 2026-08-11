import {
  CanvasAlignmentGuide,
  CanvasNodeFrame,
  CanvasPoint,
} from '../../types';
import { getObjectSnap } from '../getObjectSnap';
import { snapToGrid } from '../snapToGrid';

/**
 * A dragged node's snapped position, and the guides showing the
 * alignments it snapped to.
 */
export interface SnappedNodePosition {
  /**
   * The snapped horizontal position.
   */
  x: number;

  /**
   * The snapped vertical position.
   */
  y: number;

  /**
   * The guides for the alignments the node snapped to, empty
   * when it aligns with nothing.
   */
  guides: CanvasAlignmentGuide[];
}

export interface GetSnappedNodePositionOptions {
  /**
   * Whether the node's top left corner lands on the grid.
   */
  grid: boolean;

  /**
   * Whether the node's edges and center align to other nodes.
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
}

/**
 * Snaps a dragged node's position to the grid and to the other
 * nodes it aligns with. Aligning to the other nodes takes over
 * from the grid where they align, so the two settings combine.
 *
 * @param position - The dragged position in canvas coordinates.
 * @param frame - The node's registered frame, or null when it is unregistered.
 * @param options - Which snapping applies, and what to align to.
 * @returns The snapped position and its alignment guides.
 */
export function getSnappedNodePosition(
  position: CanvasPoint,
  frame: CanvasNodeFrame | null,
  options: GetSnappedNodePositionOptions,
): SnappedNodePosition {
  const { grid, objects, targets, threshold } = options;

  // Dragged nodes land their top left corner on the grid
  const gridX = grid ? snapToGrid(position.x) : position.x;
  const gridY = grid ? snapToGrid(position.y) : position.y;

  // Aligning to the other nodes needs the node's own frame, which
  // carries its measured size including auto heights
  if (!objects || !frame) {
    return { x: gridX, y: gridY, guides: [] };
  }

  const objectSnap = getObjectSnap(
    { x: gridX, y: gridY, width: frame.width, height: frame.height },
    targets,
    threshold,
  );

  return { x: objectSnap.x, y: objectSnap.y, guides: objectSnap.guides };
}
