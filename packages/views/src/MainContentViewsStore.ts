import { createObjectStore } from '@minddrop/stores';
import { MainContentView } from './types';

export const MainContentViewsStore = createObjectStore<MainContentView>(
  'Views:MainContent',
  'type',
);

/**
 * Retrieves a main content view by its type.
 *
 * @param type - The type of the main content view to retrieve.
 * @returns The main content view or null if it doesn't exist.
 */
export const useMainContentView = (type: string): MainContentView | null => {
  return MainContentViewsStore.useItem(type);
};

/**
 * Retrieves all main content views.
 *
 * @returns An array of all main content views.
 */
export const useMainContentViews = (): MainContentView[] => {
  return MainContentViewsStore.useAllItemsArray();
};
