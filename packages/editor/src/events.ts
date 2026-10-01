export const InsertEditorReferenceEvent = 'editor:reference:insert';

export interface InsertEditorReferenceEventData {
  /**
   * The ID of the view area containing the editor to insert into.
   */
  viewAreaId: string;

  /**
   * The pane of the view area containing the editor to insert into.
   */
  pane: string;

  /**
   * What the inserted link points at, as written between its brackets.
   */
  reference: string;

  /**
   * The part of the target the link points into, as written after the `#`.
   */
  fragment?: string;

  /**
   * The link's text.
   */
  label: string;

  /**
   * Whether to insert the link as a quote block of its own rather than
   * inline at the cursor.
   */
  quote?: boolean;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'editor:reference:insert': InsertEditorReferenceEventData;
  }
}
