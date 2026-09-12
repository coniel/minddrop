import { MockFileSystem } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { QueriesStore } from '../QueriesStore';
import { resolveQueriesDirPath } from '../utils';
import { getQueryFiles, queries } from './queries.fixtures';

const { workspace_1 } = WorkspaceFixtures;

export interface SetupQueryFixturesOptions {
  loadQueries?: boolean;
  loadQueryFiles?: boolean;
}

export function setupQueryFixtures(
  MockFs: MockFileSystem,
  options: SetupQueryFixturesOptions = {
    loadQueries: true,
    loadQueryFiles: true,
  },
) {
  // Create the queries directory
  MockFs.createDir(resolveQueriesDirPath(workspace_1.path), {
    recursive: true,
  });

  if (options.loadQueries !== false) {
    // Load queries into the store
    QueriesStore.load(queries);
  }

  if (options.loadQueryFiles !== false) {
    // Load query files into the mock file system
    MockFs.addFiles(getQueryFiles());
  }
}

export function cleanupQueryFixtures() {
  QueriesStore.clear();
}
