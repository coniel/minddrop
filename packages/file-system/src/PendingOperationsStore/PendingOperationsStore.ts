// The promises of file system operations which have not yet settled
const pendingOperations = new Set<Promise<unknown>>();

/**
 * Tracks a file system operation's promise until it settles.
 *
 * @param operation - The promise of the operation.
 */
export function trackPendingOperation(operation: Promise<unknown>): void {
  // Track the operation
  pendingOperations.add(operation);

  // Drop the operation once it settles, whichever way it settles
  void operation.then(untrack, untrack);

  function untrack(): void {
    pendingOperations.delete(operation);
  }
}

/**
 * Checks whether any file system operations are pending.
 *
 * @returns Whether any operation has not yet settled.
 */
export function hasPendingOperations(): boolean {
  return pendingOperations.size > 0;
}

/**
 * Waits until every pending file system operation has settled,
 * including operations started by the continuations of settling
 * ones.
 *
 * @returns A promise which resolves once no operations are pending.
 */
export async function awaitPendingOperations(): Promise<void> {
  // Yield to the task queue between rounds so the continuations
  // awaiting a settled operation have run, and started any follow-up
  // operations, before checking again.
  do {
    await Promise.allSettled([...pendingOperations]);
    await yieldToTaskQueue();
  } while (pendingOperations.size > 0);
}

/**
 * Resolves on the next task, once every queued microtask has run.
 * Uses a message channel rather than a timer so it keeps working
 * under fake timers.
 */
function yieldToTaskQueue(): Promise<void> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = () => {
      channel.port1.close();
      resolve();
    };

    channel.port2.postMessage(undefined);
  });
}
