import React from 'react';
import { vi } from 'vitest';
import {
  DragSource,
  cleanup as cleanupDragAndDrop,
} from '@minddrop/drag-and-drop/test-utils';
import { EntityGroups } from '@minddrop/entity-groups';
import {
  cleanup as cleanupEntityGroups,
  setup as setupEntityGroups,
} from '@minddrop/entity-groups/test-utils';
import { Selection } from '@minddrop/selection';
import { entityIdType } from '@minddrop/utils';
import { initializeEntityGroupsUi } from './initializeEntityGroupsUi';

// Register the entity group translations. Runs after the imports
// above, so it lands after the i18n initialization in
// @minddrop/test-utils which resets the resource bundles.
initializeEntityGroupsUi();

/**
 * Loads the fixtures a test runs against.
 */
export function setup(): void {
  // Load the group fixtures into the store and mock file system
  setupEntityGroups();
}

export interface ExternalDragSourceProps {
  /**
   * The ID of the entity dragged.
   */
  itemId: string;
}

/**
 * Renders a draggable standing in for an entity dragged from
 * elsewhere in the app.
 */
export const ExternalDragSource: React.FC<ExternalDragSourceProps> = ({
  itemId,
}) => {
  // The entity's type, read from its ID
  const type = entityIdType(itemId) ?? '';

  return (
    <DragSource
      id={itemId}
      type={type}
      data={{ [type]: [{ id: itemId }] }}
      testId={`external:${itemId}`}
    />
  );
};

/**
 * Resets what a test left behind.
 */
export async function cleanup(): Promise<void> {
  // End the drag a test left behind and clear its rendering
  cleanupDragAndDrop();

  // Clear the selection a test left behind
  Selection.clear();

  // Expand the groups a test collapsed, since the store is kept for
  // the app's lifetime rather than the test's.
  EntityGroups.CollapsedStore.reset();

  // Clear the group fixtures
  await cleanupEntityGroups();

  // Clear the mocks
  vi.clearAllMocks();
}
