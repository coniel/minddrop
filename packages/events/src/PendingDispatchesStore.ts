// The settlement promises of dispatches whose listeners have not
// yet settled
const pendingDispatches = new Set<Promise<unknown>>();

/**
 * Tracks a dispatch's settlement promise until it settles.
 *
 * @param settled - The promise which resolves once the dispatch's listeners have settled.
 */
export function trackPendingDispatch(settled: Promise<unknown>): void {
  // Track the dispatch
  pendingDispatches.add(settled);

  // Drop the dispatch once it settles
  void settled.then(() => {
    pendingDispatches.delete(settled);
  });
}

/**
 * Checks whether any dispatches are pending.
 *
 * @returns Whether any dispatch's listeners have not yet settled.
 */
export function hasPendingDispatches(): boolean {
  return pendingDispatches.size > 0;
}

/**
 * Waits until the listeners of every pending dispatch have settled.
 *
 * @returns A promise which resolves once no dispatches are pending.
 */
export async function awaitPendingDispatches(): Promise<void> {
  // Keep waiting while settling listeners dispatch further events
  while (pendingDispatches.size > 0) {
    await Promise.allSettled([...pendingDispatches]);
  }
}
