// Load the event data registry so the augmentation below has a
// module to merge into (nothing else here imports the events package)
import type {} from '@minddrop/events/EventDataMap';

export const ItemAddressesChangedEvent = 'item-references:addresses:changed';

/**
 * A single item's address change.
 */
export interface ItemAddressChange {
  /**
   * The ID of the item whose address changed.
   */
  id: string;

  /**
   * The item's previous durable reference.
   */
  oldReference: string;

  /**
   * The item's new durable reference.
   */
  newReference: string;
}

export type ItemAddressesChangedEventData = ItemAddressChange[];

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'item-references:addresses:changed': ItemAddressesChangedEventData;
  }
}
