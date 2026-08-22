import { MockFileSystem } from '@minddrop/file-system';
import { QueriesStore } from '../QueriesStore';
import { resolveQueriesDirPath } from '../utils';
import { getQueryFiles, queries } from './queries.fixtures';

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
  MockFs.createDir(resolveQueriesDirPath(), { recursive: true });

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
