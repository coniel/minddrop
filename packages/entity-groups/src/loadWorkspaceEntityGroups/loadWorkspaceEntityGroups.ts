import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { Workspace } from '@minddrop/workspaces';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { EntityGroupsStore } from '../EntityGroupsStore';
import { EntityGroupsLoadedEvent } from '../events';
import { readEntityGroups } from '../readEntityGroups';
import { normalizeEntityGroups } from '../utils';

/**
 * Loads a workspace's groups of every registered type into the
 * workspace's store record.
 *
 * @param workspace - The workspace whose groups to load.
 *
 * @dispatches entity-groups:loaded
 */
export async function loadWorkspaceEntityGroups(
  workspace: Workspace,
): Promise<void> {
  const configs = [...EntityGroupTypesRegistry.getAll()];

  // Load each registered type's groups
  const sets = await Promise.all(
    configs.map(async (config) => {
      const storedGroups = await readEntityGroups(config.id, workspace.path);

      // Resolve the groups' durable item references back into item
      // IDs, and restore the groups the app provides.
      const groups = normalizeEntityGroups(
        storedGroups.map((group) => ({
          ...group,
          type: config.id,
          items: ItemReferences.resolve(group.items),
        })),
        config,
      );

      return { type: config.id, groups };
    }),
  );

  // Load the sets into the workspace's store record
  EntityGroupsStore.in(workspace.id).load(sets);

  // Dispatch the loaded event with every type's groups
  Events.dispatch(
    EntityGroupsLoadedEvent,
    sets.flatMap((set) => set.groups),
  );
}
