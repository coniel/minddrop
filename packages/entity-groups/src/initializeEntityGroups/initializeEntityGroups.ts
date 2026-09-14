import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import {
  onGroupDeleted,
  onItemAddressesChanged,
  onItemDeleted,
} from '../event-handlers';
import { EntityGroupDeletedEvent } from '../events';

const EventListenerId = 'entity-groups';

/**
 * Initializes entity groups by registering the event handlers which
 * keep the groups of every registered type in step with the items
 * they hold.
 */
export function initializeEntityGroups(): void {
  const configs = [...EntityGroupTypesRegistry.getAll()];

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

  // Forget a deleted group's collapsed state
  Events.addListener(EntityGroupDeletedEvent, EventListenerId, onGroupDeleted);
}

/**
 * Reads the deleted item's ID out of a deletion event's data. Every
 * entity deletion event dispatches the deleted entity, so its ID is
 * all the handler needs and all it reads.
 */
function resolveDeletedItemId(data: unknown): string {
  return (data as { id: string }).id;
}
