import { EntryFocusRequest } from '../../types';

/**
 * Checks whether a focus request applies to an entry rendered in a
 * given view. Scoped requests apply only in the view they name, so
 * that an entry rendered in several places at once is brought
 * forward where it was created rather than everywhere.
 *
 * @param request - The pending focus request, or null when there is none.
 * @param entryId - The ID of the rendered entry.
 * @param viewId - The ID of the view the entry renders in.
 * @returns Whether the request applies.
 */
export function matchesEntryFocusRequest(
  request: EntryFocusRequest | null,
  entryId: string,
  viewId?: string,
): boolean {
  if (!request || request.entryId !== entryId) {
    return false;
  }

  // Unscoped requests apply wherever the entry renders
  if (!request.viewId) {
    return true;
  }

  return request.viewId === viewId;
}
