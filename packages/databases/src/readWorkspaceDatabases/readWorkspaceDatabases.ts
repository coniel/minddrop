import { Fs, FsEntry } from '@minddrop/file-system';
import { Paths, entityId, isEntityId } from '@minddrop/utils';
import { DatabaseConfigFileName, DatabaseEntityType } from '../constants';
import { readDatabaseConfig } from '../readDatabaseConfig';
import { Database } from '../types';
import {
  resolveDatabaseConfigFilePath,
  resolveDatabasePath,
  serializeDatabase,
} from '../utils';

/**
 * Reads all database configs from a workspace directory by
 * scanning for .minddrop/database.json files recursively.
 *
 * @param workspacePath - The absolute path to the workspace directory.
 * @param knownDatabasePaths - Map of database ID to the path last recorded for it, used to decide which of several configs claiming one ID keeps it.
 * @returns The database configs found in the workspace.
 */
export async function readWorkspaceDatabases(
  workspacePath: string,
  knownDatabasePaths: Map<string, string> = new Map(),
): Promise<Database[]> {
  // Read all files in the workspace recursively
  const workspaceFiles = await Fs.readDir(workspacePath, { recursive: true });

  // Find paths to database.json config files
  const databasePaths = findDatabasePaths(workspaceFiles);

  // Read and parse each database config
  const reads = await Promise.all(
    databasePaths.map((configPath) =>
      readDatabaseConfig(workspacePath, configPath),
    ),
  );

  // Gather the configs which could be read
  const databases = reads.flatMap((read) =>
    read.status === 'read' ? [read.value] : [],
  );

  // Work out which config keeps each claimed ID
  const idKeepers = resolveIdKeepers(databases, knownDatabasePaths);

  return Promise.all(
    databases.map(async (database) => {
      // Keep the ID of the config which owns it
      if (idKeepers.get(database.id) === database) {
        return database;
      }

      // Mint a fresh ID for missing, untyped, or duplicated IDs
      const minted = { ...database, id: entityId(DatabaseEntityType) };

      // Persist the minted ID back to the config file
      await writeDatabaseConfigFile(workspacePath, minted);

      return minted;
    }),
  );
}

/**
 * Returns the config which keeps each claimed database ID, keyed by
 * that ID.
 *
 * Copying a database directory duplicates its config file, leaving
 * two directories claiming one ID. The one already recorded at its
 * path keeps it, so that the copy rather than the original is the
 * one re-minted, whatever order the scan reached them in.
 */
function resolveIdKeepers(
  databases: Database[],
  knownDatabasePaths: Map<string, string>,
): Map<string, Database> {
  const claimants = new Map<string, Database[]>();

  // Group the configs by the ID they claim, skipping those with no
  // usable ID as they are re-minted regardless.
  databases.forEach((database) => {
    if (!database.id || !isEntityId(database.id, DatabaseEntityType)) {
      return;
    }

    const claimed = claimants.get(database.id);

    if (claimed) {
      claimed.push(database);
    } else {
      claimants.set(database.id, [database]);
    }
  });

  const keepers = new Map<string, Database>();

  claimants.forEach((claimed, id) => {
    // The config sitting where the app last recorded this database.
    // Falling back to the first found keeps the choice deterministic
    // when neither is recorded, as when both were copied in.
    const recorded = claimed.find(
      (database) => database.path === knownDatabasePaths.get(id),
    );

    keepers.set(id, recorded ?? claimed[0]);
  });

  return keepers;
}

/**
 * Finds all database config file paths in a set of directory entries.
 *
 * @param entries - The directory entries to search in.
 * @param inHiddenDir - Whether the current entries are inside a .minddrop directory.
 * @returns The paths to all database.json config files.
 */
function findDatabasePaths(entries: FsEntry[], inHiddenDir = false): string[] {
  return entries.flatMap((entry) => {
    const name = entry.path.split('/').pop();
    const isMinddropDir = name === Paths.hiddenDirName;

    if (entry.children) {
      return findDatabasePaths(entry.children, inHiddenDir || isMinddropDir);
    }

    return inHiddenDir && name === DatabaseConfigFileName ? [entry.path] : [];
  });
}

/**
 * Writes a database config file from a database object rather than
 * through `writeDatabaseConfig`, which reads from the store the scan
 * has yet to populate.
 */
async function writeDatabaseConfigFile(
  workspacePath: string,
  database: Database,
): Promise<void> {
  try {
    await Fs.writeJsonFile(
      resolveDatabaseConfigFilePath(
        resolveDatabasePath(database, workspacePath),
      ),
      serializeDatabase(database),
    );
  } catch {
    // A failed write-back simply re-mints on the next launch
  }
}
