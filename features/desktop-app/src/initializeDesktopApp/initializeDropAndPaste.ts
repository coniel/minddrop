import { DatabaseEntries } from '@minddrop/databases';
import { getTransferData, isEditableTarget } from '@minddrop/utils';

/**
 * Adds content dropped or pasted anywhere in the app to its default
 * databases.
 *
 * @returns A function which removes the listeners.
 */
export function initializeDropAndPaste(): VoidFunction {
  // Listen for drags, drops and pastes on the window
  window.addEventListener('dragover', handleDragOver);
  window.addEventListener('drop', handleDrop);
  window.addEventListener('paste', handlePaste);

  // Return a function which removes the listeners
  return () => {
    window.removeEventListener('dragover', handleDragOver);
    window.removeEventListener('drop', handleDrop);
    window.removeEventListener('paste', handlePaste);
  };
}

/**
 * Allows a native drag to be dropped anywhere in the app. Drags a drop
 * target already accepted are left to it.
 *
 * @param event - The dragover event.
 */
function handleDragOver(event: DragEvent): void {
  // Ignore drags a drop target already accepted
  if (event.defaultPrevented || !event.dataTransfer) {
    return;
  }

  // Allow the drop, as a copy of the dragged content
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

/**
 * Adds dropped content to its default databases. Drops a drop target
 * already took, and drops into editable controls, are left to them.
 *
 * @param event - The drop event.
 */
function handleDrop(event: DragEvent): void {
  // Ignore drops already taken or made onto an editable control
  if (event.defaultPrevented || isEditableTarget(event.target)) {
    return;
  }

  // Prevent the browser's default drop handling
  event.preventDefault();

  // Create entries from the dropped content
  DatabaseEntries.createFromTransferData(getTransferData(event));
}

/**
 * Adds pasted content to its default databases. Pastes already
 * handled, and pastes into editable controls, are left to them.
 *
 * @param event - The paste event.
 */
function handlePaste(event: ClipboardEvent): void {
  // Ignore pastes already handled or made into an editable control
  if (event.defaultPrevented || isEditableTarget(event.target)) {
    return;
  }

  // Create entries from the pasted content
  DatabaseEntries.createFromTransferData(getTransferData(event));
}
