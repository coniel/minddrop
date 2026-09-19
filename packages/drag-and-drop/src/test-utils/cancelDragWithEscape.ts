import { fireEvent } from '@minddrop/test-utils';
import { lastPress } from './lastPress';

/**
 * Cancels the drag in progress by pressing Escape.
 */
export function cancelDragWithEscape(): void {
  // Press Escape
  fireEvent.keyDown(window, { key: 'Escape' });

  // Clear the pressed element
  lastPress.element = null;
}
