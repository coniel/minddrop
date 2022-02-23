import { DropMap, Drops } from '@minddrop/drops';
import { useAppStore } from '../useAppStore';

/**
 * Returns a `{ [id]: Drop }` map of the drops currently
 * being dragged.
 */
export function getDraggedDrops(): DropMap {
  // Get dragged drop IDs
  const { drops } = useAppStore.getState().draggedData;

  if (drops.length === 0) {
    // No drops are currently being dragged
    return {};
  }

  // Return the dragged drops
  return Drops.get(drops);
}