import { Designs } from '@minddrop/designs-next';
import { Workspace } from '@minddrop/workspaces';
import { normalizeDatabaseConfigIds } from '../normalizeDatabaseConfigIds';
import { readDatabaseDesign } from '../readDatabaseDesign';
import { readDatabaseResourceFiles } from '../readDatabaseResourceFiles';
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
  const reads = await Promise.all(
    databases.map((database) =>
      readDatabaseResourceFiles(
        resolveDatabaseDesignsDirPath(
          resolveDatabasePath(database, workspace.path),
        ),
        (path) => readDatabaseDesign(path, database.id),
        'json',
      ),
    ),
  );

  // Normalize each config's design ID list against the designs found,
  // keeping the IDs of designs which could not be read.
  databases.forEach((database, index) => {
    normalizeDatabaseConfigIds(
      database.id,
      'designs',
      reads[index].resources,
      workspace.id,
      reads[index].unreadableIds,
    );
  });

  // Gather the designs read
  const designs = reads.flatMap((read) => read.resources);

  if (designs.length === 0) {
    return;
  }

  // Load the designs into the workspace's designs store record
  Designs.load(designs, workspace.id);
}
