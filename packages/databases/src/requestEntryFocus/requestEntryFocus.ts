import { setEntryFocusRequest } from '../EntryFocusRequestStore';

export interface RequestEntryFocusOptions {
  /**
   * The ID of the view the request applies to. When omitted, the
   * request is honoured wherever the entry renders.
   */
  viewId?: string;
}

/**
 * Requests that an entry's renderers bring the entry forward, e.g.
 * by scrolling it into view and focusing its editor. Made by the
 * action which creates an entry, whose renderers mount afterwards.
 *
 * The request is picked up by renderers which mount while it is
 * pending, and expires shortly after being made. Any pending
 * request is replaced, so a burst of creations brings forward only
 * the entry created last.
 *
 * @param entryId - The ID of the entry to bring forward.
 * @param options - Options limiting where the request applies.
 */
export function requestEntryFocus(
  entryId: string,
  options: RequestEntryFocusOptions = {},
): void {
  setEntryFocusRequest({ entryId, viewId: options.viewId });
}
