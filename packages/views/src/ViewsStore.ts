import { createArrayStore } from '@minddrop/utils';
import { View } from './types';

export const ViewsStore = createArrayStore<View>('id');

/**
 * Retrieves a View by ID or null if it doesn't exist.
 *
 * @param id - The ID of the view to retrieve.
 * @returns The view or null if it doesn't exist.
 */
export const useView = (id: string): View | null => {
  return ViewsStore.useAllItems().find((view) => view.id === id) || null;
};

/**
 * Retrieves all views.
 *
 * @returns And array of all views.
 */
export const useViews = (): View[] => {
  return ViewsStore.useAllItems();
};
