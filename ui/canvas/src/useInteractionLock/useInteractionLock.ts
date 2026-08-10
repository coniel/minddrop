import { useEffect } from 'react';
import './useInteractionLock.css';

/** Class applied to the body while an interaction is in progress. */
const INTERACTION_CLASS = 'ui-canvas-interacting';

/** Custom property carrying the cursor forced during an interaction. */
const CURSOR_PROPERTY = '--ui-canvas-interaction-cursor';

/** The number of interactions currently holding the lock. */
let lockCount = 0;

/**
 * Suppresses text selection and forces a cursor across the whole
 * document while a pointer interaction is in progress, so a drag
 * passing over text neither selects it nor picks up its cursor.
 * Applied by every canvas drag, so they all behave the same.
 *
 * @param cursor - The cursor to force, or null when no interaction is in progress.
 */
export function useInteractionLock(cursor: string | null): void {
  useEffect(() => {
    // No interaction in progress
    if (!cursor) {
      return;
    }

    lockCount += 1;

    document.body.classList.add(INTERACTION_CLASS);
    document.body.style.setProperty(CURSOR_PROPERTY, cursor);

    return () => {
      lockCount -= 1;

      // Another interaction still holds the lock, so its cursor
      // stays in place
      if (lockCount > 0) {
        return;
      }

      document.body.classList.remove(INTERACTION_CLASS);
      document.body.style.removeProperty(CURSOR_PROPERTY);
    };
  }, [cursor]);
}
