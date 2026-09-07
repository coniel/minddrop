export interface SessionSlot {
  /**
   * The id of the registered fill rendered in the slot. Without one
   * the slot shows the shell's fallback.
   */
  fill?: string;

  /**
   * Props passed to the fill component. Plain data only, since
   * sessions persist as JSON (e.g. an entry id, a database id).
   */
  props?: Record<string, unknown>;

  /**
   * When true, the slot renders nothing at all, its fallback
   * included. The chosen fill is kept, so showing the slot again
   * brings it back.
   */
  hidden?: boolean;
}
