import { MainContentViewsStore } from '../MainContentViewsStore';
import { MainContentView } from '../types';

/**
 * Registers a main content view, adding it to the store.
 *
 * @param mainContentView - The main content view to register.
 */
export function registerMainContentView(
  mainContentView: MainContentView,
): void {
  MainContentViewsStore.set(mainContentView);
}
