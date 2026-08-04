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
