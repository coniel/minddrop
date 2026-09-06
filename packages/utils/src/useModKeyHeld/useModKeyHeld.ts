import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether the meta or ctrl key has been held for at least the
 * given delay while enabled. Releasing the key reports false
 * immediately.
 *
 * @param enabled - Whether the key state is tracked.
 * @param delay - How long the key must be held before reporting true,
 * in milliseconds.
 * @returns Whether the modifier key is held.
 */
export function useModKeyHeld(enabled: boolean, delay = 0): boolean {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Cancel a pending hold and report the key as released
    function release(): void {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setHeld(false);
    }

    // Any key event reports the current modifier state
    function handleKey(event: KeyboardEvent): void {
      if (!event.metaKey && !event.ctrlKey) {
        release();

        return;
      }

      // A hold is already pending or reported
      if (timeoutRef.current !== null) {
        return;
      }

      // Report the hold once the key has been down for the delay
      timeoutRef.current = setTimeout(() => setHeld(true), delay);
    }

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    // The release is never seen when the window loses focus mid-press
    window.addEventListener('blur', release);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
      window.removeEventListener('blur', release);
      release();
    };
  }, [enabled, delay]);

  return held;
}
