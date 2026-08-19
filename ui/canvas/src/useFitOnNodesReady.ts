import { useEffect, useRef } from 'react';
import { useCanvasContext } from './CanvasContext';

/**
 * Number of animation frames to wait for the expected nodes to
 * register before falling back to the default view.
 */
const FIT_MAX_ATTEMPTS = 10;

/**
 * Fits the view once on mount, as soon as the expected nodes have
 * all registered and the viewport has been measured. Falls back
 * to the default view when the nodes fail to register in time.
 * Later changes to the expected node set do not re-fit the view.
 *
 * @param expectedNodeIds - The IDs of the nodes to wait for.
 * @param enabled - Whether to fit at all, for canvases which
 *   restore a view of their own.
 */
export function useFitOnNodesReady(
  expectedNodeIds: string[],
  enabled = true,
): void {
  const { store } = useCanvasContext();
  const idsRef = useRef(expectedNodeIds);

  // Keep the latest expected set available to the pending fit
  useEffect(() => {
    idsRef.current = expectedNodeIds;
  });

  useEffect(() => {
    // The canvas opens on a view of its own
    if (!enabled) {
      return;
    }

    let done = false;

    // Fits the view if the viewport is measured and all expected
    // nodes have registered, returning whether it fitted
    const tryFit = (): boolean => {
      const viewportSize = store.getViewportSize();

      // The viewport has not been measured yet
      if (!viewportSize.width || !viewportSize.height) {
        return false;
      }

      // No nodes are expected, reset to the default view
      if (!idsRef.current.length) {
        store.resetView();

        return true;
      }

      // Wait for every expected node to register
      if (!idsRef.current.every((nodeId) => store.getNode(nodeId))) {
        return false;
      }

      store.fitToView();

      return true;
    };

    // Fit immediately when everything is already in place
    if (tryFit()) {
      return;
    }

    // Retry on every store change until the nodes are ready
    const unsubscribe = store.useStore.subscribe(() => {
      if (!done && tryFit()) {
        done = true;
        unsubscribe();
      }
    });

    // Fall back to the default view if the nodes fail to
    // register within a few animation frames
    let attempt = 0;

    const fallback = () => {
      if (done) {
        return;
      }

      if (attempt >= FIT_MAX_ATTEMPTS) {
        done = true;
        unsubscribe();
        store.resetView();

        return;
      }

      attempt += 1;
      requestAnimationFrame(fallback);
    };

    requestAnimationFrame(fallback);

    return () => {
      done = true;
      unsubscribe();
    };
  }, [store, enabled]);
}
