import { createVanillaStore, useStore } from '@minddrop/stores';
import { EntryFocusRequestTimeoutMs } from './constants';
import { EntryFocusRequest } from './types';
import { matchesEntryFocusRequest } from './utils';

interface EntryFocusRequestState {
  /**
   * The pending focus request, null while there is none.
   */
  request: EntryFocusRequest | null;
}

// Carries a focus request from the action which created an entry to
// the entry's renderers, which mount after the request is made. A
// single slot, so that creating several entries in quick succession
// brings forward only the last of them.
const EntryFocusRequestStore = createVanillaStore<EntryFocusRequestState>(
  () => ({ request: null }),
);

// The timer expiring the pending request
let expiryTimeout: ReturnType<typeof setTimeout> | undefined;

/**
 * Sets the pending focus request, replacing any pending one, and
 * starts its expiry timer.
 *
 * @param request - The focus request.
 */
export function setEntryFocusRequest(request: EntryFocusRequest): void {
  clearTimeout(expiryTimeout);

  EntryFocusRequestStore.setState({ request });

  expiryTimeout = setTimeout(
    clearEntryFocusRequest,
    EntryFocusRequestTimeoutMs,
  );
}

/**
 * Clears the pending focus request.
 */
export function clearEntryFocusRequest(): void {
  clearTimeout(expiryTimeout);

  EntryFocusRequestStore.setState({ request: null });
}

/**
 * Retrieves the pending focus request.
 *
 * @returns The pending focus request, or null when there is none.
 */
export function getEntryFocusRequest(): EntryFocusRequest | null {
  return EntryFocusRequestStore.getState().request;
}

/**
 * Watches whether an entry rendered in a given view has been asked
 * to bring itself forward, e.g. by scrolling into view or focusing
 * its editor.
 *
 * @param entryId - The ID of the rendered entry.
 * @param viewId - The ID of the view the entry renders in.
 * @returns Whether focus was requested for the entry.
 */
export function useEntryFocusRequest(
  entryId: string,
  viewId?: string,
): boolean {
  return useStore(EntryFocusRequestStore, (state) =>
    matchesEntryFocusRequest(state.request, entryId, viewId),
  );
}
