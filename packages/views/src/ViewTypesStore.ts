import { createObjectStore } from '@minddrop/stores';
import { ViewType } from './types';

export const ViewTypesStore = createObjectStore<ViewType>(
  'Views:Types',
  'type',
);

/**
 * Retrieves a view type by its type.
 *
 * @param type - The type of the view type to retrieve.
 * @returns The view type or null if it doesn't exist.
 */
export const useViewType = (type: string): ViewType | null => {
  return ViewTypesStore.useItem(type);
};

/**
 * Retrieves all view types.
 *
 * @returns An array of all view types.
 */
export const useViewTypes = (): ViewType[] => {
  return ViewTypesStore.useAllItemsArray();
};
