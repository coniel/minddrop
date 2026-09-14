import { vi } from 'vitest';
import { SidebarGroups } from '@minddrop/app';
import { SidebarGroupFixtures } from '@minddrop/app/test-utils';
import { Collections } from '@minddrop/collections';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { EntityGroups } from '@minddrop/entity-groups';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { Queries } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { Spaces } from '@minddrop/spaces';
import { SpaceFixtures } from '@minddrop/spaces/test-utils';
import { Tags } from '@minddrop/tags';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { initializeEntityGroupsUi } from '@minddrop/ui-entity-groups';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { locales } from '../locales';

initializeI18n();

// Register the desktop app and entity group translations. Runs
// after the i18n initialization above, which resets the resource
// bundles.
I18n.registerTranslations(locales);
initializeEntityGroupsUi();

export const MockFs = initializeMockFileSystem();

// Register the sidebar's entity group type, which its groups are
// held under. Registered once for the file rather than per test.
SidebarGroups.initialize();

export function setup(): void {
  // Load the workspace the sidebar's groups are written into
  setupWorkspaceFixtures(MockFs);

  // Load the entities the sidebar's items render
  Databases.Store.load(DatabaseFixtures.databases);
  DatabaseEntries.Store.load(DatabaseFixtures.databaseEntries);
  DataViews.Store.load(DataViewFixtures.dataViews);
  Spaces.Store.load(SpaceFixtures.spaces);
  Collections.Store.load(CollectionFixtures.collections);
  Queries.Store.load(QueryFixtures.queries);
  Tags.Store.load(TagFixtures.tags);

  // Load the sidebar's groups, alongside the app provided ones
  EntityGroups.Store.load([
    {
      type: SidebarGroups.constants.Type,
      groups: SidebarGroupFixtures.sidebarGroups,
    },
  ]);
}

export async function cleanup(): Promise<void> {
  // Unmount any rendered components
  cleanupRender();

  // Clear mocked function state
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  Databases.Store.clear();
  DatabaseEntries.Store.clear();
  DataViews.Store.clear();
  Spaces.Store.clear();
  Collections.Store.clear();
  Queries.Store.clear();
  Tags.Store.clear();

  // Drop the sidebar groups type and its groups
  EntityGroups.Store.clear();

  cleanupWorkspaceFixtures();

  // Events.tests.cleanup() is deliberately not used: it would also remove
  // the hydrate listeners persistent stores register when their modules
  // are first loaded, which cannot be registered again, leaving
  // hydrate() unable to resolve for the rest of the run. Tests remove
  // the listeners they register themselves.
}
