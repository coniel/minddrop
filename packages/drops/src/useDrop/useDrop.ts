import { Drop } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Returns a drop by ID or `null` if no drop was found.
 *
 * @param dropId The ID of the drop to retrieve.
 * @returns The requested drop or null.
 */
export function useDrop(dropId: string): Drop | null {
  const { drops } = useDropsStore();
  return drops[dropId] || null;
}
