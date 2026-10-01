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

// A single slot, so that creating several entries in quick succession
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
  // Cancel the pending request's expiry
  clearTimeout(expiryTimeout);

  // Replace the pending request
  EntryFocusRequestStore.setState({ request });

  // Expire the request
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
 * Watches the pending focus request applying to an entry rendered in
 * a given view. Each request is a new object. A repeated request
 * returns a new object, even while the first is pending.
 *
 * @param entryId - The ID of the rendered entry.
 * @param viewId - The ID of the view the entry renders in.
 * @returns The focus request, or null while none applies.
 */
export function useEntryFocusRequest(
  entryId: string,
  viewId?: string,
): EntryFocusRequest | null {
  return useStore(EntryFocusRequestStore, (state) =>
    matchesEntryFocusRequest(state.request, entryId, viewId)
      ? state.request
      : null,
  );
}
