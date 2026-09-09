/**
 * A request for an entry's renderers to bring the entry forward,
 * typically made by the action which created the entry.
 */
export interface EntryFocusRequest {
  /**
   * The ID of the entry to bring forward.
   */
  entryId: string;

  /**
   * The ID of the view the request applies to. Requests made without
   * one are honoured wherever the entry renders.
   */
  viewId?: string;
}
