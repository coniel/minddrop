import { ViewsStore } from '../ViewsStore';
import { View } from '../types';

/**
 * Registers a view, adding it to the store.
 *
 * @param view - The view to register.
 */
export function registerView(view: View): void {
  ViewsStore.set(view);
}
