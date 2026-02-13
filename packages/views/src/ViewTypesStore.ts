import { createArrayStore } from '@minddrop/utils';
import { ViewType } from './types';

export const ViewTypesStore = createArrayStore<ViewType>('type');

/**
 * Retrieves a view type by its type.
 *
 * @param type - The type of the view type to retrieve.
 * @returns The view type or null if it doesn't exist.
 */
export const useViewType = (type: string): ViewType | null => {
  return (
    ViewTypesStore.useAllItems().find((view) => view.type === type) || null
  );
};

/**
 * Retrieves all view types.
 *
 * @returns And array of all view types.
 */
export const useViewTypes = (): ViewType[] => {
  return ViewTypesStore.useAllItems();
};
