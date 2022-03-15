import { Drop } from '../types';
import { useDropsStore } from '../useDropsStore';
import { DropNotFoundError } from '../errors';

/**
 * Retrieves a drop by ID from the drops store.
 *
 * @param id The drop ID.
 * @returns The requested drop.
 */
export function getDrop<T extends Drop = Drop>(id: string): T {
  const drop = useDropsStore.getState().drops[id] as T;

  if (!drop) {
    throw new DropNotFoundError(id);
  }

  return drop;
}
