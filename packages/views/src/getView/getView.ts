import { ViewsStore } from '../ViewsStore';
import { View } from '../types';

/**
 * Gets the view with the specified type.
 *
 * @param type - The type of the view to get.
 * @returns The view, or null if it is not registered.
 */
export function getView(type: string): View | null {
  return ViewsStore.get(type) ?? null;
}
