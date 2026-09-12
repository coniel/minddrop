import { Design, Designs } from '@minddrop/designs-next';
import { Fs } from '@minddrop/file-system';
import { Workspace } from '@minddrop/workspaces';
import { normalizeDatabaseConfigIds } from '../normalizeDatabaseConfigIds';
import type { Database } from '../types';
import { resolveDatabaseDesignsDirPath, resolveDatabasePath } from '../utils';

/**
 * Loads database designs from the databases' design directories
 * into the workspace's designs store record, normalizing each
 * database config's design ID list against the design files found.
 *
 * @param databases - The databases whose designs to load.
 * @param workspace - The workspace the databases belong to.
 */
export async function loadDatabaseDesigns(
  databases: Database[],
  workspace: Workspace,
): Promise<void> {
  // Read each database's stored designs from disk
  const designs = (
    await Promise.all(
      databases.map((database) => readDatabaseDesigns(database, workspace)),
    )
  ).flat();

  if (designs.length === 0) {
    return;
  }

  // Load the designs into the workspace's designs store record
  Designs.load(designs, workspace.id);
}

/**
 * Reads a database's stored designs from its designs directory and
 * normalizes the config's design ID list against them.
 *
 * @param database - The database whose designs to read.
 * @param workspace - The workspace the database belongs to.
 * @returns The database's designs with the database attached as owner.
 */
async function readDatabaseDesigns(
  database: Database,
  workspace: Workspace,
): Promise<Design[]> {
  // Path to the database's designs directory
  const dirPath = resolveDatabaseDesignsDirPath(
    resolveDatabasePath(database, workspace.path),
  );

  // The stored designs read from the designs directory, empty for
  // databases without one.
  let storedDesigns: Design[] = [];

  if (await Fs.exists(dirPath)) {
    // List the design files
    const designFiles = await Fs.readDir(dirPath);

    // Read and deserialize each design file, dropping invalid ones
    storedDesigns = (
      await Promise.all(
        designFiles
          .filter((file) => file.path.endsWith('.json'))
          .map((file) => Designs.read(file.path)),
      )
    ).filter((storedDesign): storedDesign is Design => !!storedDesign);
  }

  // Normalize the config's design ID list against the designs found
  normalizeDatabaseConfigIds(
    database.id,
    'designs',
    storedDesigns,
    workspace.id,
  );

  // Attach the database as the owner of its designs
  return storedDesigns.map((storedDesign) => ({
    ...storedDesign,
    owner: database.id,
  }));
}
