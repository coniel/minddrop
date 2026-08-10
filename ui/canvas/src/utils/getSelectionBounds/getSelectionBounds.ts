import { CanvasNodeFrame } from '../../types';
import { unionFrames } from '../unionFrames';

/**
 * Returns the frame enclosing the given nodes, skipping IDs with
 * no registered frame. Returns null when none of them resolve.
 *
 * @param ids - The IDs of the nodes to enclose.
 * @param nodes - The node frame registry.
 * @returns The enclosing frame, or null when no node resolves.
 */
export function getSelectionBounds(
  ids: string[],
  nodes: Record<string, CanvasNodeFrame>,
): CanvasNodeFrame | null {
  // Selected nodes that are not mounted have no frame to enclose
  const frames = ids
    .map((id) => nodes[id])
    .filter((frame): frame is CanvasNodeFrame => Boolean(frame));

  return unionFrames(frames);
}
