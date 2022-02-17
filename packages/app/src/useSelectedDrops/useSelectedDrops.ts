import { DropMap, Drops } from '@minddrop/drops';
import { useAppStore } from '../useAppStore';

/**
 * Returns the currently selected drops.
 */
export function useSelectedDrops(): DropMap {
  const { selectedDrops } = useAppStore();

  return Drops.get(selectedDrops);
}
