import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspace } from '@minddrop/workspaces';
import { QueriesStore } from '../QueriesStore';
import { QueriesLoadedEvent } from '../events';
import { readQuery } from '../readQuery';
import { resolveQueriesDirPath } from '../utils';

/**
 * Loads a workspace's queries from its queries directory into the
 * workspace's store record.
 *
 * If the queries directory does not exist, it will be created.
 *
 * @param workspace - The workspace whose queries to load.
 *
 * @dispatches queries:loaded
 */
export async function loadWorkspaceQueries(
  workspace: Workspace,
): Promise<void> {
  const queriesDirPath = resolveQueriesDirPath(workspace.path);

  // Ensure that the queries directory exists
  await Fs.ensureDir(queriesDirPath);

  // Load queries from the queries directory
  const files = await Fs.readDir(queriesDirPath);

  // Read the query files
  const queryPromises = await Promise.all(
    files.map((file) => readQuery(file.path)),
  );

  // Filter out null queries
  const queries = queryPromises.filter((query) => query !== null);

  // Load the queries into the workspace's store record
  QueriesStore.in(workspace.id).load(queries);

  // Dispatch a queries loaded event
  Events.dispatch(QueriesLoadedEvent, queries);
}
