// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { ItemReferences } from '@minddrop/item-references';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { EntityGroupsStore } from '../EntityGroupsStore';
import { registerEntityGroupType } from '../registerEntityGroupType';
import { EntityGroup } from '../types';
import { resolveEntityGroupsDirPath } from '../utils';
import {
  entityGroupSets,
  groupTypeConfigs,
  groupsFilePath,
  itemReferenceAdapter,
} from './entity-groups.fixtures';

const { workspace_1 } = WorkspaceFixtures;

export const MockFs = initializeMockFileSystem();

/**
 * Reads a group type's groups back out of its written file. Their
 * items are durable references rather than item IDs.
 *
 * @param type - The group type.
 * @returns The written groups.
 */
export function readWrittenEntityGroups(type: string): EntityGroup[] {
  return MockFs.readJsonFile(groupsFilePath(type)) as EntityGroup[];
}

/**
 * Reads a single group back out of its type's written file.
 *
 * @param type - The group type.
 * @param id - The ID of the group to read.
 * @returns The written group, or undefined if the file has none.
 */
export function readWrittenEntityGroup(
  type: string,
  id: string,
): EntityGroup | undefined {
  return readWrittenEntityGroups(type).find((group) => group.id === id);
}

export function setup(): void {
  setupWorkspaceFixtures(MockFs);

  // Create the directory the groups files are written into
  MockFs.createDir(resolveEntityGroupsDirPath(workspace_1.path), {
    recursive: true,
  });

  // Register the group types the fixtures describe
  groupTypeConfigs.forEach(registerEntityGroupType);

  // Load their groups into the store
  EntityGroupsStore.load(entityGroupSets);

  // Register the addressed item reference adapter
  ItemReferences.registerAdapter(itemReferenceAdapter);
}

export async function cleanup(): Promise<void> {
  // Clear mocked function state
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  EntityGroupsStore.clear();
  EntityGroupTypesRegistry.clear();

  // Unregister the addressed item reference adapter
  ItemReferences.unregisterAdapter(itemReferenceAdapter.type);

  await Events.tests.cleanup();
  cleanupWorkspaceFixtures();
}
