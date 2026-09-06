import { Selection } from '@minddrop/selection';
import { isEditableTarget } from '@minddrop/utils';

export function initializeSelection(): void {
  window.addEventListener('keydown', handleKeyDown);
}

/**
 * Deletes the currently selected items on Delete/Backspace and
 * clears the selection on Escape, leaving presses inside editable
 * controls to them.
 *
 * @param event - The keydown event.
 */
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    // The press belongs to the control being typed into
    if (isEditableTarget(event.target)) {
      return;
    }

    // Delete all items in the current selection
    event.preventDefault();
    Selection.delete();
  }

  if (event.key === 'Escape') {
    if (Selection.isEmpty()) {
      return;
    }

    // Clear the selection when the escape key is pressed
    event.preventDefault();
    Selection.clear();
  }
}
