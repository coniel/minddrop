import { useCallback, useSyncExternalStore } from 'react';
import { useOptionalCanvasContext } from '../CanvasContext';
import { CanvasPoint } from '../types';

export interface UseCanvasNodeSelectionResult {
  /**
   * Whether the node is part of the canvas's current selection.
   */
  selected: boolean;

  /**
   * The offset of the in-progress group drag the node is part of,
   * or null when it is not being group dragged.
   */
  selectionOffset: CanvasPoint | null;
}

/**
 * Subscribes a node to the canvas instance's selection. Returns
 * an unselected node without a CanvasProvider, since standalone
 * nodes have no store to subscribe to.
 *
 * @param id - The node's ID within the canvas.
 * @param selectable - Whether the node takes part in the selection.
 * @returns The node's selection state.
 */
export function useCanvasNodeSelection(
  id: string,
  selectable: boolean,
): UseCanvasNodeSelectionResult {
  const context = useOptionalCanvasContext();

  // Subscribe to the canvas instance's store, which holds the
  // selection. Standalone nodes have no store to subscribe to.
  const subscribeToStore = useCallback(
    (onStoreChange: VoidFunction) =>
      context ? context.store.useStore.subscribe(onStoreChange) : () => {},
    [context],
  );

  // Whether the node is in the canvas's current selection
  const getSelectedSnapshot = useCallback(
    () => Boolean(selectable && context?.store.isNodeSelected(id)),
    [context, selectable, id],
  );

  const selected = useSyncExternalStore(subscribeToStore, getSelectedSnapshot);

  // The offset of an in-progress group drag this node is part of.
  // The store holds one offset for the whole selection, so the
  // snapshot is a stable reference between updates.
  const getSelectionOffsetSnapshot = useCallback(
    () =>
      selectable && context?.store.isNodeSelected(id)
        ? context.store.getSelectionDrag()
        : null,
    [context, selectable, id],
  );

  const selectionOffset = useSyncExternalStore(
    subscribeToStore,
    getSelectionOffsetSnapshot,
  );

  return { selected, selectionOffset };
}
