/**
 * A request for an entry's renderers to bring the entry forward.
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

  /**
   * The part of the entry to bring forward, as a link fragment: an
   * anchor within the entry, `^id`, or a heading. Requests made
   * without one bring the entry itself forward.
   */
  fragment?: string;
}
