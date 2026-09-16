import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { PropertiesSchema } from '@minddrop/properties';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseEntrySerializersRegistry } from '../DatabaseEntrySerializersRegistry';
import { DatabaseEntryWrittenEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import {
  resolveDatabaseEntryPath,
  serializeCollectionProperties,
} from '../utils';

export interface WriteDatabaseEntryOptions {
  /**
   * Properties which have left the database schema but whose values
   * must be cleared from the entry's file. Serializers which merge
   * into the file's existing contents only clear values of properties
   * the schema declares.
   */
  clearedProperties?: PropertiesSchema;

  /**
   * The workspace the entry belongs to. Omit for the active workspace.
   */
  workspaceId?: string;
}

/**
 * Writes an entry to the file system.
 *
 * @param id - The ID of the entry to write.
 * @param options - Options for the write.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry database does not exist.
 * @throws {NotRegisteredError} If the entry serializer is not registered.
 *
 * @dispatches databases:entry:written
 */
export async function writeDatabaseEntry(
  id: string,
  options: WriteDatabaseEntryOptions = {},
): Promise<void> {
  const { clearedProperties = [], workspaceId } = options;

  // Get the entry
  const entry = getDatabaseEntry(id, true, workspaceId);

  // Get the parent database
  const database = getDatabase(entry.database, true, workspaceId);

  // Path to the entry's primary file
  const entryPath = resolveDatabaseEntryPath(
    entry,
    database,
    Workspaces.resolvePath(workspaceId),
  );

  // If the database uses entry based storage, ensure the entry
  // subdirectory exists.
  if (database.propertyFileStorage === 'entry') {
    await Fs.ensureDir(Fs.parentDirPath(entryPath));
  }

  // Convert collection property members to durable addresses
  const properties = serializeCollectionProperties(
    entry.properties,
    database,
    workspaceId,
  );

  // Read the entry's current content so the serializer can merge into it
  // rather than regenerating it, preserving anything MindDrop does not model.
  const previousContents = (await Fs.exists(entryPath))
    ? await Fs.readTextFile(entryPath)
    : undefined;

  // Declare the cleared properties alongside the schema. A declared
  // property with no value is how the serializer removes it.
  const schema = [...database.properties, ...clearedProperties];

  // Serialize the entry's properties
  const serializer = DatabaseEntrySerializersRegistry.get(
    database.entrySerializer,
  );
  const contents = serializer.serialize(schema, properties, previousContents);

  // Check whether the file already holds what would be written. If so,
  // record it as the app's own contents anyway, or a file the app has
  // just moved is taken for an external change by the watcher.
  if (contents === previousContents) {
    Fs.recordWrittenContents(entryPath, contents);

    return;
  }

  // Write the entry file
  await Fs.writeTextFile(entryPath, contents);

  Events.dispatch(DatabaseEntryWrittenEvent, {
    entry,
    database,
    previousContents,
    contents,
  });
}
