import { vi } from 'vitest';
import {
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from '@minddrop/collections/test-utils';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { Queries } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { Spaces } from '@minddrop/spaces';
import { SpaceFixtures } from '@minddrop/spaces/test-utils';
import { Tags } from '@minddrop/tags';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Set up the workspace fixtures first, so that the workspace
  // scoped stores load into the active workspace's record.
  setupWorkspaceFixtures(MockFs);

  // Load database and entry fixtures into the stores and mock
  // file system.
  DatabaseFixtures.setup(MockFs);

  // Load collection fixtures into the store and mock file system
  setupCollectionFixtures(MockFs);

  // Load the other entities the entity search lists
  DataViews.Store.load(DataViewFixtures.dataViews);
  Spaces.Store.load(SpaceFixtures.spaces);
  Queries.Store.load(QueryFixtures.queries);
  Tags.Store.load(TagFixtures.tags);
}

export async function cleanup(): Promise<void> {
  cleanupRender();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  DatabaseFixtures.cleanup();
  cleanupCollectionFixtures();
  DataViews.Store.clear();
  Spaces.Store.clear();
  Queries.Store.clear();
  Tags.Store.clear();
  await Events.tests.cleanup();
  vi.clearAllMocks();
  cleanupWorkspaceFixtures();
}
