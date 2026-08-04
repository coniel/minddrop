/**
 * The result of matching a durable item reference against the
 * registered adapters.
 */
export interface ItemReferenceMatch {
  /**
   * The entity type of the item the reference points to.
   */
  type: string;

  /**
   * The matched item's runtime ID, or null when the reference is a
   * valid address whose item does not exist yet.
   */
  id: string | null;
}
