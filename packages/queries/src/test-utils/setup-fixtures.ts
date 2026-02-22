import { MockFileSystem } from '@minddrop/file-system';
import { QueriesStore } from '../QueriesStore';
import { getQueriesDirPath } from '../utils';
import { queries, queryFiles } from './queries.fixtures';

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
  MockFs.createDir(getQueriesDirPath(), { recursive: true });

  if (options.loadQueries !== false) {
    // Load queries into the store
    QueriesStore.load(queries);
  }

  if (options.loadQueryFiles !== false) {
    // Load query files into the mock file system
    MockFs.addFiles(queryFiles);
  }
}

export function cleanupQueryFixtures() {
  QueriesStore.clear();
}
