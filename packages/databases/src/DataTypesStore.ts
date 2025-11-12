import { createArrayStore } from '@minddrop/utils';
import { DataType } from './types';

export const DataTypesStore = createArrayStore<DataType>('type');

/**
 * Retrieves a data type by type or null if it doesn't exist.
 *
 * @param type - The type of the data type to retrieve.
 * @returns The data type or null if it doesn't exist.
 */
export const useDataType = (type: string): DataType | null => {
  return (
    DataTypesStore.useAllItems().find((config) => config.type === type) || null
  );
};

/**
 * Retrieves all data types.
 *
 * @returns And array of all data types.
 */
export const useDataTypes = (): DataType[] => {
  return DataTypesStore.useAllItems();
};
