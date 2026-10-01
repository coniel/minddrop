import { useEffect, useState } from 'react';

/**
 * Tracks the document's text selection, resolved to a value of the
 * caller's choosing. A selection made with the mouse is resolved once
 * the button is released, not while it is dragged out. A cleared
 * selection is returned at once.
 *
 * Must be passed a stable `resolve`.
 *
 * @param resolve - Resolves the DOM selection to a value, or null for none.
 * @returns The resolved selection, or null while there is none.
 */
export function useSettledSelection<TSelection>(
  resolve: (selection: Selection | null) => TSelection | null,
): TSelection | null {
  // The resolved selection
  const [selection, setSelection] = useState<TSelection | null>(null);

  // Track the selection as it changes and as the mouse is released
  useEffect(() => {
    // Whether a mouse button is held
    let pressed = false;

    // Resolve the current DOM selection
    function resolveSelection(): TSelection | null {
      return resolve(window.getSelection());
    }

    // Mark the button held
    function handleMouseDown() {
      pressed = true;
    }

    // Mark the button released and store the selection it made
    function handleMouseUp() {
      pressed = false;
      setSelection(resolveSelection());
    }

    // Store a changed selection
    function handleSelectionChange() {
      // Resolve the new selection
      const next = resolveSelection();

      // Skip a selection while the button is held. A cleared selection
      // is still stored.
      if (pressed && next) {
        return;
      }

      setSelection(next);
    }

    // Listen for presses, releases and selection changes
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);

    // Stop listening on unmount
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [resolve]);

  return selection;
}
