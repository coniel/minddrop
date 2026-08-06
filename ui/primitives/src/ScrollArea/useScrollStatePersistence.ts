import React, { useCallback, useEffect, useRef } from 'react';
import { useTransientViewStateContext } from '../TransientViewState/TransientViewStateContext';
import { useTransientViewStateKey } from '../TransientViewState/TransientViewStateScope';

// Trailing debounce for persisting scroll positions
const WRITE_DEBOUNCE_MS = 300;
// How long to keep re-attempting a restore while content loads
const RESTORE_GIVE_UP_MS = 2000;
// Tolerance when comparing scroll positions
const POSITION_TOLERANCE_PX = 1;

/*
 * A recorded scroll position.
 */
interface StoredScrollPosition {
  top: number;
  left: number;
}

/*
 * useScrollStatePersistence
 * Records and restores a scroll area's scroll position via the
 * surrounding transient view state context. Inert when no state
 * key is given or no provider is present.
 * Attach viewportRef to the viewport element and call
 * handlePersistScroll from its scroll handler.
 */
export function useScrollStatePersistence(stateKey: string | undefined) {
  // Storage backend, null when no provider is present
  const context = useTransientViewStateContext();

  // Full key including the accumulated scope path
  const fullKey = useTransientViewStateKey(stateKey ?? '');

  // Persistence is active only with both a key and a backend
  const active = Boolean(stateKey && context);

  // The scrollable viewport element
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Position awaiting a debounced write
  const pendingWriteRef = useRef<StoredScrollPosition | null>(null);
  // Debounce timer for the pending write
  const writeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Last position written to the backend, used to skip no-op writes
  const lastWrittenRef = useRef<StoredScrollPosition | null>(null);

  // Whether a restore is in progress
  const restoringRef = useRef(false);
  // Position last applied programmatically, used to detect echoes
  const lastProgrammaticRef = useRef<StoredScrollPosition | null>(null);
  // Observer re-attempting the restore as content grows
  const restoreObserverRef = useRef<ResizeObserver | null>(null);
  // Timer abandoning the restore once the give-up window passes
  const giveUpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stop the restore machinery, keeping the reached position. Leaves
  // lastProgrammaticRef set so the trailing echo of the final applied
  // scroll can still be recognized after the restore ends.
  const cancelRestore = useCallback(() => {
    // Stop re-attempting on content growth
    restoreObserverRef.current?.disconnect();
    restoreObserverRef.current = null;

    // Clear the give-up timer
    if (giveUpTimeoutRef.current) {
      clearTimeout(giveUpTimeoutRef.current);
      giveUpTimeoutRef.current = null;
    }

    // Leave restore mode
    restoringRef.current = false;
  }, []);

  // Write the pending position to the backend
  const flushPendingWrite = useCallback(() => {
    // Clear the debounce timer
    if (writeTimeoutRef.current) {
      clearTimeout(writeTimeoutRef.current);
      writeTimeoutRef.current = null;
    }

    const pending = pendingWriteRef.current;

    // Nothing to write
    if (!pending || !context) {
      return;
    }

    pendingWriteRef.current = null;

    // Skip the write when the position has not changed
    if (
      lastWrittenRef.current &&
      isNearPosition(lastWrittenRef.current, pending)
    ) {
      return;
    }

    // Persist the position
    lastWrittenRef.current = pending;
    context.set(fullKey, pending);
  }, [context, fullKey]);

  // Record scroll positions, ignoring programmatic echoes. Returns
  // whether the event was the echo of a programmatic restore scroll,
  // so callers can skip user-facing scroll feedback for it.
  const handlePersistScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>): boolean => {
      // Do nothing when persistence is inactive
      if (!active) {
        return false;
      }

      const position = {
        top: event.currentTarget.scrollTop,
        left: event.currentTarget.scrollLeft,
      };

      // Consume the echo of a programmatic restore scroll without
      // recording it
      if (
        lastProgrammaticRef.current &&
        isNearPosition(position, lastProgrammaticRef.current)
      ) {
        lastProgrammaticRef.current = null;

        return true;
      }

      // The user scrolled mid-restore, their position wins
      if (restoringRef.current) {
        cancelRestore();
        lastProgrammaticRef.current = null;
      }

      // Stage the position for a trailing debounced write
      pendingWriteRef.current = position;

      // Restart the debounce timer
      if (writeTimeoutRef.current) {
        clearTimeout(writeTimeoutRef.current);
      }

      writeTimeoutRef.current = setTimeout(
        flushPendingWrite,
        WRITE_DEBOUNCE_MS,
      );

      return false;
    },
    [active, cancelRestore, flushPendingWrite],
  );

  // Restore the stored position on mount and key changes
  useEffect(() => {
    const viewport = viewportRef.current;

    // Do nothing when persistence is inactive or unmounted
    if (!active || !context || !viewport) {
      return;
    }

    // Reset any stale programmatic marker from a previous restore
    lastProgrammaticRef.current = null;

    const stored = context.get(fullKey);

    // Only restore meaningful stored positions
    if (isStoredScrollPosition(stored) && (stored.top > 0 || stored.left > 0)) {
      // Enter restore mode so echoes are ignored
      restoringRef.current = true;

      // Apply the stored position, succeeding once it sticks
      const attemptRestore = () => {
        viewport.scrollTop = stored.top;
        viewport.scrollLeft = stored.left;

        // Read back the applied position, clamped by content size
        const actual = {
          top: viewport.scrollTop,
          left: viewport.scrollLeft,
        };
        lastProgrammaticRef.current = actual;

        // The full position stuck, restore is complete
        if (isNearPosition(actual, stored)) {
          // Seed the write dedupe so the echo write is skipped
          lastWrittenRef.current = actual;
          cancelRestore();
        }
      };

      attemptRestore();

      // Content may still be loading, re-attempt as it grows
      if (restoringRef.current) {
        const observer = new ResizeObserver(attemptRestore);
        observer.observe(viewport);

        // Content growth resizes the child, not the viewport box
        if (viewport.firstElementChild) {
          observer.observe(viewport.firstElementChild);
        }

        restoreObserverRef.current = observer;
        giveUpTimeoutRef.current = setTimeout(
          cancelRestore,
          RESTORE_GIVE_UP_MS,
        );
      }
    }

    return () => {
      // Stop any in-progress restore
      cancelRestore();

      // Persist the latest recorded position before detaching
      flushPendingWrite();
    };
  }, [active, context, fullKey, cancelRestore, flushPendingWrite]);

  return { viewportRef, handlePersistScroll };
}

/*
 * Whether a stored value has the shape of a scroll position.
 */
function isStoredScrollPosition(value: unknown): value is StoredScrollPosition {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const position = value as Record<string, unknown>;

  return typeof position.top === 'number' && typeof position.left === 'number';
}

/*
 * Whether two positions match within the comparison tolerance.
 */
function isNearPosition(
  position: StoredScrollPosition,
  other: StoredScrollPosition,
): boolean {
  return (
    Math.abs(position.top - other.top) <= POSITION_TOLERANCE_PX &&
    Math.abs(position.left - other.left) <= POSITION_TOLERANCE_PX
  );
}
