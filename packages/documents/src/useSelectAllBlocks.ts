import { useEffect } from 'react';
import { Selection } from '@minddrop/selection';

/**
 * Registers a keyboard event listener that selects all blocks when the user presses
 * `Cmd+A` or `Ctrl+A`.
 *
 * @param blockIds - The IDs of the blocks to appearing in the view.
 */
export function useSelectAllBlocks(blockIds?: string[]) {
  useEffect(() => {
    const handleSelectAll = (event: KeyboardEvent) => {
      if (!blockIds) {
        return;
      }

      if (event.key === 'a' && (event.metaKey || event.ctrlKey)) {
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

        event.preventDefault();

        // Select all blocks
        Selection.add(blockIds.map((id) => ({ id, type: 'block' })));
      }
    };

    window.addEventListener('keydown', handleSelectAll);

    return () => {
      window.removeEventListener('keydown', handleSelectAll);
    };
  }, [blockIds]);
}
