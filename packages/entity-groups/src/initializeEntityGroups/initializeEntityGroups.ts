import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { EntityGroupsStore } from '../EntityGroupsStore';
import { onItemAddressesChanged, onItemDeleted } from '../event-handlers';
import { EntityGroupsLoadedEvent } from '../events';
import { readEntityGroups } from '../readEntityGroups';
import { normalizeEntityGroups } from '../utils';

const EventListenerId = 'entity-groups';

/**
 * Initializes the groups of every registered type, loading the
 * stored groups and registering the event handlers which keep them
 * in step with the items they hold.
 *
 * @dispatches entity-groups:loaded
 */
export async function initializeEntityGroups(): Promise<void> {
  const configs = [...EntityGroupTypesRegistry.getAll()];

  // Load each registered type's groups
  const sets = await Promise.all(
    configs.map(async (config) => {
      const storedGroups = await readEntityGroups(config.id);

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

  EntityGroupsStore.load(sets);

  // Drop a deleted item from the groups of the type it belongs to
  configs.forEach((config) => {
    (config.itemDeletedEvents ?? []).forEach((eventName) =>
      Events.addListener(eventName, EventListenerId, (data) =>
        onItemDeleted(config.id, resolveDeletedItemId(data)),
      ),
    );
  });

  // Keep the stored item references current when addresses change
  Events.addListener(
    ItemReferences.events.AddressesChanged,
    EventListenerId,
    onItemAddressesChanged,
  );

  // Dispatch the loaded event with every type's groups
  Events.dispatch(
    EntityGroupsLoadedEvent,
    sets.flatMap((set) => set.groups),
  );
}

/**
 * Reads the deleted item's ID out of a deletion event's data. Every
 * entity deletion event dispatches the deleted entity, so its ID is
 * all the handler needs and all it reads.
 */
function resolveDeletedItemId(data: unknown): string {
  return (data as { id: string }).id;
}
