import { useEffect, useRef } from 'react';
import { isEditableTarget } from '../isEditableTarget';

/**
 * Calls back on Delete or Backspace presses anywhere in the
 * document, leaving presses inside editable controls to them and
 * preventing the press's default action otherwise. The latest
 * callback is always the one called, so it need not be stable.
 *
 * @param onDelete - Called with the press.
 * @param enabled - Whether to listen at all, e.g. only while
 *   something is selected. Defaults to true.
 */
export function useDeleteKey(
  onDelete: (event: KeyboardEvent) => void,
  enabled = true,
): void {
  const onDeleteRef = useRef(onDelete);

  // Keep the latest callback available to the listener
  useEffect(() => {
    onDeleteRef.current = onDelete;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Delete' && event.key !== 'Backspace') {
        return;
      }

      // The press belongs to the control being typed into
      if (isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      onDeleteRef.current(event);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
