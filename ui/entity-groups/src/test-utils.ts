import { vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import {
  cleanup as cleanupEntityGroups,
  setup as setupEntityGroups,
} from '@minddrop/entity-groups/test-utils';
import { Selection } from '@minddrop/selection';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { initializeEntityGroupsUi } from './initializeEntityGroupsUi';

// Register the entity group translations. Runs after the imports
// above, so it lands after the i18n initialization in
// @minddrop/test-utils which resets the resource bundles.
initializeEntityGroupsUi();

export function setup(): void {
  // Load the group fixtures into the store and mock file system
  setupEntityGroups();
}

/**
 * Returns a stand-in for the data transfer object the browser hands
 * a drag, which the test environment does not provide. It carries
 * the data set on it from the drag start to the drop, as a real one
 * does.
 *
 * @returns The data transfer object.
 */
export function dragDataTransfer(): DataTransfer {
  const data: Record<string, string> = {};

  return {
    setData: (key: string, value: string) => {
      data[key] = value;
    },
    getData: (key: string) => data[key] ?? '',
    get types() {
      return Object.keys(data);
    },
    files: [],
  } as unknown as DataTransfer;
}

export async function cleanup(): Promise<void> {
  cleanupRender();

  // Clear the drag a test left behind
  Selection.clear();
  Selection.Store.getState().setIsDragging(false);

  // Expand the groups a test collapsed, the store being kept for the
  // app's lifetime rather than the test's.
  EntityGroups.CollapsedStore.reset();

  await cleanupEntityGroups();

  vi.clearAllMocks();
}
