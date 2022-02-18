import { DropMap, Drops } from '@minddrop/drops';
import { useAppStore } from '../useAppStore';

/**
 * Returns the currently selected drops.
 */
export function useSelectedDrops(): DropMap {
  // Get selected drop IDs
  const { selectedDrops } = useAppStore();

  if (selectedDrops.length === 0) {
    // No drops are selected
    return {};
  }

  // Return the selected drops
  return Drops.get(selectedDrops);
}
