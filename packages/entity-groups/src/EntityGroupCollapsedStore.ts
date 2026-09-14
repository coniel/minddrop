import { createKeyValueStore } from '@minddrop/stores';

/**
 * Which groups the user has collapsed, keyed by type and group ID.
 * A group is expanded unless the store says otherwise.
 *
 * Kept per workspace on this device: which groups are collapsed is
 * how one person left their sidebar, not something the workspace
 * carries between them.
 */
export const EntityGroupCollapsedStore = createKeyValueStore<
  Record<string, boolean>
>(
  'EntityGroups:Collapsed',
  {},
  {
    persist: {
      target: 'app-workspace-config',
      namespace: 'entity-group-collapsed',
    },
    scope: 'workspace',
  },
);

/**
 * Returns the key a group's collapsed state is stored under. Keyed
 * by type as well as ID, the app's own groups being identified by a
 * fixed ID which two types can share.
 *
 * @param type - The entity group type.
 * @param groupId - The ID of the group.
 * @returns The store key.
 */
export function entityGroupCollapsedKey(type: string, groupId: string): string {
  return `${type}:${groupId}`;
}

/**
 * Returns whether the group is collapsed, re-rendering when it is
 * expanded or collapsed.
 *
 * @param type - The entity group type.
 * @param groupId - The ID of the group.
 * @returns Whether the group is collapsed.
 */
export function useEntityGroupCollapsed(
  type: string,
  groupId: string,
): boolean {
  return (
    EntityGroupCollapsedStore.useValue(
      entityGroupCollapsedKey(type, groupId),
    ) ?? false
  );
}
