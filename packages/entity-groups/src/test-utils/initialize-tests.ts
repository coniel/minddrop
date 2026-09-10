// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { ItemReferences } from '@minddrop/item-references';
import { Paths } from '@minddrop/utils';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { EntityGroupsStore } from '../EntityGroupsStore';
import { EntityGroupsDirName } from '../constants';
import { registerEntityGroupType } from '../registerEntityGroupType';
import { EntityGroup } from '../types';
import {
  entityGroupSets,
  groupTypeConfigs,
  groupsFilePath,
  itemReferenceAdapter,
} from './entity-groups.fixtures';

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
  // Create the directory the groups files are written into
  MockFs.createDir(Fs.concatPath(Paths.workspaceConfigs, EntityGroupsDirName), {
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
}
