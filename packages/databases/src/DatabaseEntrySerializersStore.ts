import { createArrayStore } from '@minddrop/utils';
import { DatabaseEntrySerializer } from './types';

export const DatabaseEntrySerializersStore =
  createArrayStore<DatabaseEntrySerializer>('id');

/**
 * Retrieves a serializer by ID or null if it doesn't exist.
 *
 * @param id - The ID of the serializer to retrieve.
 * @returns The serializer or null if it doesn't exist.
 */
export const useDatabaseEntrySerializer = (
  id: string,
): DatabaseEntrySerializer | null => {
  return (
    DatabaseEntrySerializersStore.useAllItems().find(
      (config) => config.id === id,
    ) || null
  );
};

/**
 * Retrieves all registered serializers.
 *
 * @returns And array of all registered serializers.
 */
export const useDatabaseEntrySerializerSerializers =
  (): DatabaseEntrySerializer[] => {
    return DatabaseEntrySerializersStore.useAllItems();
  };
