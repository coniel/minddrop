export interface SlotClaim {
  /**
   * The id of the registered fill rendered in the slot.
   */
  fill: string;

  /**
   * Props passed to the fill component. Plain data only, since
   * sessions persist as JSON (e.g. an entry id, a database id).
   */
  props?: Record<string, unknown>;
}
