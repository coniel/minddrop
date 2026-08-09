import { useCanvasContext } from './CanvasContext';
import { CanvasState } from './types';

/**
 * Subscribes to the current canvas instance's store with a
 * selector. Must be used within a CanvasProvider.
 *
 * @param selector - Selects the slice of canvas state to subscribe to.
 * @returns The selected state.
 */
export function useCanvasStore<TSelected>(
  selector: (state: CanvasState) => TSelected,
): TSelected {
  const { store } = useCanvasContext();

  return store.useStore(selector);
}
