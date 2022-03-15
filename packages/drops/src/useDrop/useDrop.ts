import { Drop } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Returns a drop by ID or `null` if no drop was found.
 *
 * @param dropId The ID of the drop to retrieve.
 * @returns The requested drop or null.
 */
export function useDrop<T extends Drop = Drop>(dropId: string): T | null {
  const { drops } = useDropsStore();
  return (drops[dropId] as T) || null;
}
