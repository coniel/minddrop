import { createObjectStore } from '@minddrop/stores';
import { View } from './types';

export const ViewsStore = createObjectStore<View>('Views:Registered', 'type');

/**
 * Retrieves a view by its type.
 *
 * @param type - The type of the view to retrieve.
 * @returns The view or null if it doesn't exist.
 */
export const useView = (type: string): View | null => {
  return ViewsStore.useItem(type);
};

/**
 * Retrieves all views.
 *
 * @returns An array of all views.
 */
export const useViews = (): View[] => {
  return ViewsStore.useAllItemsArray();
};
