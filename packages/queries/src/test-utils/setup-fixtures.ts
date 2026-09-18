import { EntityGroups } from '@minddrop/entity-groups';
import { MockFileSystem } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { QueriesStore } from '../QueriesStore';
import { QueryGroupsTypeConfig } from '../QueryGroupsTypeConfig';
import { QueryGroupsType } from '../constants';
import { resolveQueriesDirPath } from '../utils';
import { getQueryFiles, queries } from './queries.fixtures';
import { getQueryGroupFiles, queryGroups } from './query-groups.fixtures';

const { workspace_1 } = WorkspaceFixtures;

export interface SetupQueryFixturesOptions {
  loadQueries?: boolean;
  loadQueryFiles?: boolean;
  loadQueryGroups?: boolean;
  loadQueryGroupFiles?: boolean;
}

export function setupQueryFixtures(
  MockFs: MockFileSystem,
  options: SetupQueryFixturesOptions = {
    loadQueries: true,
    loadQueryFiles: true,
    loadQueryGroups: true,
    loadQueryGroupFiles: true,
  },
) {
  // Create the queries directory
  MockFs.createDir(resolveQueriesDirPath(workspace_1.path), {
    recursive: true,
  });

  // Register the query groups type, which the query group functions
  // look up.
  EntityGroups.registerType(QueryGroupsTypeConfig);

  if (options.loadQueries !== false) {
    // Load queries into the store
    QueriesStore.load(queries);
  }

  if (options.loadQueryFiles !== false) {
    // Load query files into the mock file system
    MockFs.addFiles(getQueryFiles());
  }

  if (options.loadQueryGroups !== false) {
    // Load query groups into the entity groups store
    EntityGroups.Store.load([{ type: QueryGroupsType, groups: queryGroups }]);
  }

  if (options.loadQueryGroupFiles !== false) {
    // Load the query groups file into the mock file system
    MockFs.addFiles(getQueryGroupFiles());
  }
}

export function cleanupQueryFixtures() {
  QueriesStore.clear();

  // Drops the type's groups along with the type
  EntityGroups.unregisterType(QueryGroupsType);
}
