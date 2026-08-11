import { CanvasNodeFrame } from '../../types';
import { framesIntersect } from '../framesIntersect';

/**
 * Returns the frames a node's interactions snap to: the other
 * nodes at least partially within the viewport. Falls back to all
 * other nodes while the viewport is unmeasured.
 *
 * @param nodes - The registered node frames keyed by node ID.
 * @param nodeId - The ID of the node being interacted with.
 * @param viewport - The visible canvas area, or null when unmeasured.
 * @returns The frames to snap to.
 */
export function getVisibleSnapTargets(
  nodes: Record<string, CanvasNodeFrame>,
  nodeId: string,
  viewport: CanvasNodeFrame | null,
): CanvasNodeFrame[] {
  return Object.entries(nodes)
    .filter(([id, frame]) => {
      // The node cannot snap to itself
      if (id === nodeId) {
        return false;
      }

      // Off-screen nodes are not worth aligning to, since their
      // guides would point off the canvas
      return !viewport || framesIntersect(frame, viewport);
    })
    .map(([, frame]) => frame);
}
