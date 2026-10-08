import { ContentViews } from '@minddrop/content-views';
import { Workspace } from '@minddrop/workspaces';
import { normalizeDatabaseConfigIds } from '../normalizeDatabaseConfigIds';
import { readDatabaseResourceFiles } from '../readDatabaseResourceFiles';
import { readDatabaseView } from '../readDatabaseView';
import type { Database } from '../types';
import {
  resolveDatabaseContentViewsDirPath,
  resolveDatabasePath,
} from '../utils';

/**
 * Loads database views from the databases' view directories into
 * the workspace's content views store record as virtual views.
 * Normalizes each database config's view ID list against the view
 * files found.
 *
 * @param databases - The databases whose views to load.
 * @param workspace - The workspace the databases belong to.
 */
export async function loadDatabaseViews(
  databases: Database[],
  workspace: Workspace,
): Promise<void> {
  // Read each database's stored views from disk
  const reads = await Promise.all(
    databases.map((database) =>
      readDatabaseResourceFiles(
        resolveDatabaseContentViewsDirPath(
          resolveDatabasePath(database, workspace.path),
        ),
        (path) => readDatabaseView(path, database.id, workspace.id),
        'json',
      ),
    ),
  );

  // Normalize each config's view ID list against the views found. The
  // IDs of views which could not be read are kept.
  databases.forEach((database, index) => {
    normalizeDatabaseConfigIds(
      database.id,
      'views',
      reads[index].resources,
      workspace.id,
      reads[index].unreadableIds,
    );
  });

  // Gather the views read
  const views = reads.flatMap((read) => read.resources);

  if (views.length === 0) {
    return;
  }

  // Load the views as virtual views
  ContentViews.loadVirtual(views, workspace.id);
}
