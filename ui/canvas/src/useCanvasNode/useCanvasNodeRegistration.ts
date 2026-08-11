import { useEffect } from 'react';
import { useOptionalCanvasContext } from '../CanvasContext';
import { CanvasNodeFrame } from '../types';

/**
 * Keeps a node's live frame in the canvas instance's node
 * registry, which the canvas reads to fit, align and connect
 * nodes. Does nothing without a CanvasProvider, since standalone
 * nodes have no registry to join.
 *
 * @param id - The node's ID within the canvas.
 * @param frame - The node's live frame in canvas coordinates.
 */
export function useCanvasNodeRegistration(
  id: string,
  frame: CanvasNodeFrame,
): void {
  const context = useOptionalCanvasContext();
  const { x, y, width, height } = frame;

  // Register the frame, and re-register it on every change
  useEffect(() => {
    if (!context) {
      return;
    }

    context.store.registerNode(id, { x, y, width, height });
  }, [context, id, x, y, width, height]);

  // Unregister the node when it unmounts
  useEffect(() => {
    if (!context) {
      return;
    }

    return () => {
      context.store.unregisterNode(id);
    };
  }, [context, id]);
}
