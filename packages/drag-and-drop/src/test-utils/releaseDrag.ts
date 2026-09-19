import { fireEvent } from '@minddrop/test-utils';
import { DragGestureOptions } from './DragGestureOptions.types';
import { lastPress } from './lastPress';

/**
 * Releases the drag in progress where the pointer is, then fires the
 * click the browser fires for the release. The click lands on the
 * nearest common ancestor of the pressed and released elements.
 *
 * @param options - Where the pointer is released.
 */
export function releaseDrag(options: DragGestureOptions = {}): void {
  // Resolve the release point and the element under it
  const { clientX = 0, clientY = 0 } = options;
  const released = document.elementFromPoint(clientX, clientY) ?? document.body;

  // Release the pointer
  fireEvent.pointerUp(window, { clientX, clientY, button: 0, buttons: 0 });

  // Fire the click where the browser would
  fireEvent.click(resolveCommonAncestor(lastPress.element, released), {
    clientX,
    clientY,
  });

  // Clear the pressed element
  lastPress.element = null;
}

/**
 * Resolves the nearest ancestor two elements share.
 *
 * @param pressed - The pressed element, or null when none was pressed.
 * @param released - The released element.
 * @returns The common ancestor, or the released element when none was pressed.
 */
function resolveCommonAncestor(
  pressed: Element | null,
  released: Element,
): Element {
  // Start from the pressed element
  let ancestor: Element | null = pressed;

  // Walk the pressed element's ancestors until one contains the
  // released element.
  while (ancestor && !ancestor.contains(released)) {
    ancestor = ancestor.parentElement;
  }

  // Fall back to the released element when none was pressed
  return ancestor ?? released;
}
