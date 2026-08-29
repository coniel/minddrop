import { persistIndex } from './persistIndex';

// Debounce delay for persisting the index to disk (ms)
const PERSIST_DEBOUNCE_MS = 5000;

// Per-workspace persist timers for debounced saves
const persistTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Debounces persisting the index to disk. Waits PERSIST_DEBOUNCE_MS
 * after the last call before actually writing.
 *
 * @param workspaceId - The workspace whose index to persist.
 */
export function debouncedPersist(workspaceId: string): void {
  // Push back the pending persist, if any
  const existingTimer = persistTimers.get(workspaceId);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Schedule the persist
  const timer = setTimeout(() => {
    persistIndex(workspaceId);
    persistTimers.delete(workspaceId);
  }, PERSIST_DEBOUNCE_MS);

  persistTimers.set(workspaceId, timer);
}

/**
 * Cancels all pending debounced persists. Intended for test
 * cleanup so no persist fires after the test's SQL database
 * has been closed.
 */
export function cancelDebouncedPersists(): void {
  // Drop every scheduled persist
  for (const timer of persistTimers.values()) {
    clearTimeout(timer);
  }

  persistTimers.clear();
}
