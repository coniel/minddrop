import { MainContentViewsStore } from '../MainContentViewsStore';
import { MainContentView } from '../types';

/**
 * Gets the main content view with the specified type.
 *
 * @param type - The type of the main content view to get.
 * @returns The main content view, or null if it is not registered.
 */
export function getMainContentView(type: string): MainContentView | null {
  return MainContentViewsStore.get(type) ?? null;
}
