/**
 * An item of a filterable entity type, as listed for picking.
 */
export interface FilterableItem {
  /**
   * The item's ID.
   */
  id: string;

  /**
   * The name the item is displayed under.
   */
  label: string;

  /**
   * The item's stringified content icon, if any.
   */
  icon?: string;
}
