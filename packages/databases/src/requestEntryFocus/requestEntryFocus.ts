import { setEntryFocusRequest } from '../EntryFocusRequestStore';

export interface RequestEntryFocusOptions {
  /**
   * The ID of the view the request applies to. When omitted, the
   * request is honoured wherever the entry renders.
   */
  viewId?: string;

  /**
   * The part of the entry to bring forward, as a link fragment.
   * When omitted, the entry itself is brought forward.
   */
  fragment?: string;
}

/**
 * Requests that an entry's renderers bring the entry forward. The
 * request is picked up by renderers which mount while it is pending,
 * expires shortly after being made, and replaces any pending request.
 *
 * @param entryId - The ID of the entry to bring forward.
 * @param options - Where the request applies and what part of the entry it names.
 */
export function requestEntryFocus(
  entryId: string,
  options: RequestEntryFocusOptions = {},
): void {
  setEntryFocusRequest({
    entryId,
    viewId: options.viewId,
    fragment: options.fragment,
  });
}
