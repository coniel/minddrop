import { ItemReferenceMatch } from './ItemReferenceMatch.types';

/**
 * Converts between an entity type's runtime item IDs and the durable
 * references persisted in app-managed files and linked content. One
 * adapter is registered per entity type by the package owning the
 * type.
 */
export interface ItemReferenceAdapter {
  /**
   * The entity type the adapter handles, matching the type prefix
   * of the items' runtime IDs.
   */
  type: string;

  /**
   * Converts a runtime item ID into a durable reference, or null
   * when the item cannot be resolved.
   */
  serialize(id: string): string | null;

  /**
   * Matches a durable reference against the adapter's address
   * format. Returns null when the reference does not belong to the
   * adapter, leaving it to later-registered adapters. A match with
   * a null ID marks a valid address whose item does not exist yet.
   */
  match(reference: string): ItemReferenceMatch | null;
}
