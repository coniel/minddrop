import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { InvalidParameterError, validateDirName } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseUpdatedEvent, DatabaseUpdatedEventData } from '../events';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import { getDatabase } from '../getDatabase';
import { Database, PropertyFileStorage } from '../types';
import { updateDatabaseEntryProperty } from '../updateDatabaseEntryProperty';
import {
  entryAssetsDirPath,
  getDatabasePropertyDirs,
  getPropertyFilePath,
  resolveEntryFilePath,
  resolvePropertyFilePath,
  resolvePropertyFilesDirName,
} from '../utils';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Changes a database's property file storage mode, physically relocating the
 * existing property files (and wrapping or unwrapping entry files in per-entry
 * directories) to match the new layout. Filename collisions that arise when
 * collapsing into a shared directory are resolved by incrementing the name and
 * updating the property value.
 *
 * @param id - The ID of the database to update.
 * @param storage - The new property file storage mode.
 * @param propertyFilesDir - The common directory name, used only in `common` mode.
 * @returns The updated database config.
 *
 * @dispatches databases:database:update
 */
export async function setDatabasePropertyFileStorage(
  id: string,
  storage: PropertyFileStorage,
  propertyFilesDir?: string,
): Promise<Database> {
  // Reject unsafe common directory names before touching the file system,
  // allowing hidden folder names
  if (propertyFilesDir && validateDirName(propertyFilesDir, true)) {
    throw new InvalidParameterError(
      `Invalid property files directory name: ${propertyFilesDir}`,
    );
  }

  // Get the current config, used as the event's original state
  const database = getDatabase(id);

  const oldStorage = database.propertyFileStorage;
  const newDirName = resolvePropertyFilesDirName(propertyFilesDir);
  const oldDirName = resolvePropertyFilesDirName(database.propertyFilesDir);

  // The directory name only matters in common storage
  const dirChanged = storage === 'common' && newDirName !== oldDirName;

  // Nothing to do when neither the mode nor the common directory changes
  if (storage === oldStorage && !dirChanged) {
    return database;
  }

  const wasEntry = oldStorage === 'entry';
  const willEntry = storage === 'entry';

  const entries = getAllDatabaseEntries(id);
  const fileProperties = database.properties.filter(Properties.isFileBased);

  // Phase 1: capture the current on-disk state before mutating anything.
  // Each entry's file extension and assets directory.
  const entryMoves = entries.map((entry) => ({
    entry,
    fileExtension: Fs.getFileExtension(entry.path),
    oldAssetsDir: entryAssetsDirPath(entry.path),
  }));

  // Each property file's current path, plus the data needed to resolve its
  // destination and rewrite its value on a collision.
  const propertyFileMoves = entries.flatMap((entry) =>
    fileProperties.flatMap((property) => {
      const value = entry.properties[property.name];

      // Skip properties without a file value
      if (typeof value !== 'string' || value === '') {
        return [];
      }

      return [
        {
          entryId: entry.id,
          entryTitle: entry.title,
          propertyName: property.name,
          fileName: value,
          oldPath: getPropertyFilePath(entry.id, property.name, value),
        },
      ];
    }),
  );

  // The shared directories the old and new layouts use, for cleanup
  const oldSharedDirs = getDatabasePropertyDirs(database);
  const newSharedDirs = getDatabasePropertyDirs({
    ...database,
    propertyFileStorage: storage,
    propertyFilesDir,
  });

  // Phase 2: wrap or unwrap entry files when crossing the entry boundary.
  if (wasEntry !== willEntry) {
    for (const { entry, fileExtension, oldAssetsDir } of entryMoves) {
      const newEntryPath = resolveEntryFilePath(
        database.path,
        storage,
        entry.title,
        fileExtension,
      );
      const newEntryDir = Fs.parentDirPath(newEntryPath);

      // Ensure the destination directory (the wrapper when entering entry mode)
      if (!(await Fs.exists(newEntryDir))) {
        await Fs.createDir(newEntryDir);
      }

      // Move the entry file to its new location
      if (await Fs.exists(entry.path)) {
        await Fs.rename(entry.path, newEntryPath);
      }

      // Relocate the entry's assets directory if it has one
      if (await Fs.exists(oldAssetsDir)) {
        const newAssetsDir = entryAssetsDirPath(newEntryPath);

        // Ensure the assets directory's parent exists before moving it
        await Fs.createDir(Fs.parentDirPath(newAssetsDir), { recursive: true });
        await Fs.rename(oldAssetsDir, newAssetsDir);
      }

      // Update the entry's stored path before any later re-serialization
      DatabaseEntriesStore.update(entry.id, { path: newEntryPath });
    }
  }

  // Phase 3: move each property file to its new location.
  for (const move of propertyFileMoves) {
    // Skip files that are missing on disk
    if (!(await Fs.exists(move.oldPath))) {
      continue;
    }

    const destination = resolvePropertyFilePath({
      databasePath: database.path,
      mode: storage,
      propertyFilesDirName: newDirName,
      entryTitle: move.entryTitle,
      propertyName: move.propertyName,
      fileName: move.fileName,
    });
    const destinationDir = Fs.parentDirPath(destination);

    // Ensure the destination directory exists before resolving conflicts
    if (!(await Fs.exists(destinationDir))) {
      await Fs.createDir(destinationDir);
    }

    // Increment the name if it collides with an already-placed file
    const { path: finalPath, name: finalName } =
      await Fs.incrementalPath(destination);

    // Move the file to its final location
    await Fs.rename(move.oldPath, finalPath);

    // Persist the new file name when a collision forced a rename
    if (finalName !== move.fileName) {
      await updateDatabaseEntryProperty(
        move.entryId,
        move.propertyName,
        finalName,
      );
    }
  }

  // Phase 4: remove directories the old layout no longer needs.
  // Unwrapped entry directories only hold emptied assets scaffolding.
  if (wasEntry && !willEntry) {
    for (const { entry } of entryMoves) {
      const wrapperDir = Fs.concatPath(database.path, entry.title);

      // Trash the wrapper directory and any leftover scaffolding
      if (await Fs.exists(wrapperDir)) {
        await Fs.trashDir(wrapperDir);
      }
    }
  }

  // Old shared directories the new layout no longer uses, when empty
  for (const dir of oldSharedDirs) {
    // Keep directories the new layout still uses
    if (newSharedDirs.includes(dir)) {
      continue;
    }

    // Only trash the directory when it holds no other files
    if ((await Fs.exists(dir)) && (await Fs.readDir(dir)).length === 0) {
      await Fs.trashDir(dir);
    }
  }

  // Phase 5: commit the config change and notify listeners.
  DatabasesStore.update(id, {
    propertyFileStorage: storage,
    // Only touch the directory name in common mode to avoid config churn
    propertyFilesDir:
      storage === 'common' ? propertyFilesDir : database.propertyFilesDir,
    lastModified: new Date(),
  });

  // Persist the updated config to disk
  await writeDatabaseConfig(id);

  const updated = getDatabase(id);

  // Dispatch a database updated event
  Events.dispatch<DatabaseUpdatedEventData>(DatabaseUpdatedEvent, {
    original: database,
    updated,
  });

  return updated;
}
