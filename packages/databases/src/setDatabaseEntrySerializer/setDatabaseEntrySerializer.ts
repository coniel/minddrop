import { AppErrorEvent, Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { EntryConversionBackupDirName } from '../constants';
import { DatabaseUpdatedEvent } from '../events';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import { Database, DatabaseEntry } from '../types';
import { serializeCollectionProperties } from '../utils';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Changes a database's entry serializer, converting the existing entry
 * files to the new format and file extension.
 *
 * The original entry files are kept in a backup directory during the
 * conversion and moved to the system trash once it succeeds. If the
 * conversion fails, the original files, entry paths, and config are
 * restored and an app error event is dispatched instead of throwing.
 *
 * @param id - The ID of the database to update.
 * @param serializerId - The ID of the new entry serializer.
 * @returns The updated database config.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {DatabaseEntrySerializerNotRegisteredError} If the serializer is not registered.
 *
 * @dispatches databases:database:updated
 * @dispatches app:error
 */
export async function setDatabaseEntrySerializer(
  id: string,
  serializerId: string,
): Promise<Database> {
  // Get the current config, used as the event's original state
  const database = getDatabase(id);

  // Nothing to do when the serializer is unchanged
  if (serializerId === database.entrySerializer) {
    return database;
  }

  // Ensure the new serializer is registered before touching any files
  const serializer = getDatabaseEntrySerializer(serializerId);

  // Get the database's entries for conversion
  const entries = getAllDatabaseEntries(id);

  // Directory the original entry files are kept in during the conversion,
  // prefixed with the database name to identify it in the system trash
  const backupDir = Fs.concatPath(
    database.path,
    Paths.hiddenDirName,
    `${database.name} ${EntryConversionBackupDirName}`,
  );

  // Original files moved into the backup directory, tracked for rollback
  const backedUpFiles: BackedUpFile[] = [];
  // New format files written so far, tracked for rollback
  const writtenFiles: string[] = [];
  // Whether the config change was committed to the store
  let configCommitted = false;

  try {
    // Ensure the backup directory exists
    if (!(await Fs.exists(backupDir))) {
      await Fs.createDir(backupDir, { recursive: true });
    }

    // Phase 1: back up the original files and repath all entries to the
    // new extension before writing anything, so each entry is written
    // to its converted path.
    for (const entry of entries) {
      // The entry file path with the new serializer's extension
      const newPath = `${Fs.removeExtension(entry.path)}.${serializer.fileExtension}`;

      // Move the original file into the backup directory
      if (await Fs.exists(entry.path)) {
        const backupPath = Fs.concatPath(
          backupDir,
          Fs.fileNameFromPath(entry.path),
        );

        await Fs.rename(entry.path, backupPath);
        backedUpFiles.push({ originalPath: entry.path, backupPath });
      }

      // Update the entry's stored path
      DatabaseEntriesStore.update(entry.id, { path: newPath });
    }

    // Phase 2: write each entry file in the new format.
    for (const entry of entries) {
      // Get the entry with its updated path
      const updatedEntry = getDatabaseEntry(entry.id);

      // Convert collection property members to durable addresses
      const properties = serializeCollectionProperties(
        updatedEntry.properties,
        database,
      );

      // Serialize the entry's properties with the new serializer
      const serializedEntry = serializer.serialize(
        database.properties,
        properties,
      );

      // Write the converted entry file
      await Fs.writeTextFile(updatedEntry.path, serializedEntry);
      writtenFiles.push(updatedEntry.path);
    }

    // Commit the config change
    DatabasesStore.update(id, {
      entrySerializer: serializerId,
      lastModified: new Date(),
    });
    configCommitted = true;

    // Persist the updated config to disk
    await writeDatabaseConfig(id);
  } catch (error) {
    // Restore the pre-conversion state
    await rollbackConversion({
      database,
      entries,
      backedUpFiles,
      writtenFiles,
      backupDir,
      configCommitted,
    });

    // Notify the UI of the failed conversion
    Events.dispatch(AppErrorEvent, {
      title: 'databases.settings.entrySerializer.error.title',
      message: 'databases.settings.entrySerializer.error.message',
      error,
    });

    return getDatabase(id);
  }

  // Move the backup directory to the system trash so the original files
  // remain recoverable
  try {
    await Fs.trashDir(backupDir);
  } catch {
    // Leave the backup directory in place, the conversion itself succeeded
  }

  const updated = getDatabase(id);

  // Dispatch a database updated event
  Events.dispatch(DatabaseUpdatedEvent, {
    original: database,
    updated,
  });

  return updated;
}

interface BackedUpFile {
  /**
   * The entry file's path before the conversion.
   */
  originalPath: string;

  /**
   * The file's path inside the backup directory.
   */
  backupPath: string;
}

interface RollbackOptions {
  /**
   * The database config from before the conversion.
   */
  database: Database;

  /**
   * The database's entries with their pre-conversion paths.
   */
  entries: DatabaseEntry[];

  /**
   * The original files moved into the backup directory.
   */
  backedUpFiles: BackedUpFile[];

  /**
   * The new format files written before the failure.
   */
  writtenFiles: string[];

  /**
   * Path to the backup directory.
   */
  backupDir: string;

  /**
   * Whether the config change was committed to the store.
   */
  configCommitted: boolean;
}

/**
 * Restores the pre-conversion state after a failed serializer change:
 * removes the new format files, moves the original files back out of
 * the backup directory, and reverts the entry paths and config.
 */
async function rollbackConversion(options: RollbackOptions): Promise<void> {
  const {
    database,
    entries,
    backedUpFiles,
    writtenFiles,
    backupDir,
    configCommitted,
  } = options;

  try {
    // Remove the new format files
    for (const path of writtenFiles) {
      if (await Fs.exists(path)) {
        await Fs.removeFile(path);
      }
    }

    // Move the original files back to their pre-conversion paths
    for (const { originalPath, backupPath } of backedUpFiles) {
      if (await Fs.exists(backupPath)) {
        await Fs.rename(backupPath, originalPath);
      }
    }

    // Restore the entries' pre-conversion stored paths
    for (const entry of entries) {
      DatabaseEntriesStore.update(entry.id, { path: entry.path });
    }

    // Remove the emptied backup directory
    if (await Fs.exists(backupDir)) {
      await Fs.trashDir(backupDir);
    }

    // Revert the config change when it was already committed
    if (configCommitted) {
      DatabasesStore.update(database.id, {
        entrySerializer: database.entrySerializer,
        lastModified: new Date(),
      });

      // Persist the reverted config to disk
      await writeDatabaseConfig(database.id);
    }
  } catch {
    // Leave the rollback partial, the dispatched error surfaces the failure
  }
}
