import { Selection } from '@minddrop/selection';

export function initializeSelection(): void {
  window.addEventListener('keydown', handleKeyDown);
}

/**
 * Deletes the currently selected items when the delete or backspace key is pressed
 * unless the focused element is an editor (input, textarea, or contenteditable).
 *
 * @param event - The keydown event.
 */
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    // Check if the focused element is an editor (input, textarea, or contenteditable)
    const activeElement = document.activeElement;

    // Check if the active element is an input, textarea, or contenteditable element
    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLDivElement).isContentEditable)
    ) {
      // Allow the default backspace behavior in input fields or textareas
      return;
    }

    // If not inside an editor, prevent the default action (backspace in input/textarea)
    event.preventDefault();

    // Delete all items in the current selection
    Selection.delete();
  }

  if (event.key === 'Escape') {
    if (Selection.isEmpty()) {
      return;
    }

    event.preventDefault();

    // Clear the selection when the escape key is pressed
    Selection.clear();
  }
}
