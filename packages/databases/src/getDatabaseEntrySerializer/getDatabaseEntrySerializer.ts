import { DatabaseEntrySerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabaseEntrySerializerNotRegisteredError } from '../errors';
import { DatabaseEntrySerializer } from '../types';

/**
 * Retrieves a database entry serializer by ID.
 *
 * @param id - The ID of the serializer.
 * @returns The serializer.
 *
 * @throws {DatabaseEntrySerializerNotRegisteredError} If the serializer is not registered.
 */
export function getDatabaseEntrySerializer(
  id: string,
): DatabaseEntrySerializer {
  // Get the serializer from the store
  const serializer = DatabaseEntrySerializersStore.get(id);

  // Ensure the serializer exists
  if (!serializer) {
    throw new DatabaseEntrySerializerNotRegisteredError(id);
  }

  return serializer;
}
