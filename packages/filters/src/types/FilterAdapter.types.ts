import { PropertyValue } from '@minddrop/properties';
import { PropertyFilter } from './PropertyFilter.types';

/**
 * Plugs an entity type into filtering: how its items are looked
 * up, listed, read and named. Items are matched to their adapter
 * by the type prefix of their IDs.
 */
export interface FilterAdapter<TItem extends { id: string } = { id: string }> {
  /**
   * The entity type, matching the type prefix of the items' IDs.
   */
  type: string;

  /**
   * Retrieves an item by ID, or null when it does not exist.
   */
  get(id: string): TItem | null;

  /**
   * Returns every item.
   */
  getAll(): TItem[];

  /**
   * Returns the value an item holds for a filter's property, or
   * undefined when it has none.
   */
  resolveValue(item: TItem, filter: PropertyFilter): PropertyValue | undefined;

  /**
   * Returns the name an item is displayed under.
   */
  label(item: TItem): string;

  /**
   * Returns an item's stringified content icon, or undefined when
   * it has none.
   */
  icon?(item: TItem): string | undefined;
}
