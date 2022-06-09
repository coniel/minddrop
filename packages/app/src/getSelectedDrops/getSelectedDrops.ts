import { DropMap, Drops } from '@minddrop/drops';
import { useAppStore } from '../useAppStore';

/**
 * Returns the currently selected drops.
 */
export function getSelectedDrops(): DropMap {
  const { selectedDrops } = useAppStore.getState();

  return Drops.get(selectedDrops);
}
