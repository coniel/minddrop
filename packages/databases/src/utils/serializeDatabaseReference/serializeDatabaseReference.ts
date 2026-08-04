import { Paths } from '@minddrop/utils';
import { DatabasesStore } from '../../DatabasesStore';

/**
 * Serializes a database ID into the database's durable address, its
 * workspace-relative directory name.
 *
 * @param id - The database ID to serialize.
 * @returns The database address, or null if the database does not exist.
 */
export function serializeDatabaseReference(id: string): string | null {
  // Look up the database to get its current path
  const database = DatabasesStore.get(id);

  // IDs that do not resolve cannot be serialized
  if (!database) {
    return null;
  }

  return database.path.replace(`${Paths.workspace}/`, '');
}
