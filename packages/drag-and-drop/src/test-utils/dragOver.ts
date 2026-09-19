import { createDomRect, fireEvent } from '@minddrop/test-utils';
import { DragGestureOptions } from './DragGestureOptions.types';
import { lastPress } from './lastPress';

// The bounds a target with none is measured at. Needed to resolve a
// drop position from the pointer position.
const DEFAULT_TARGET_RECT = createDomRect(0, 0, 100, 100);

/**
 * Drags an element over another and leaves the drag in progress. Hit
 * testing resolves to the target wherever the pointer is. A zero-size
 * target is measured as 100px square at the viewport's origin.
 *
 * @param source - The element to drag.
 * @param target - The element to drag it over.
 * @param options - Where the pointer ends up, and the keys held.
 */
export function dragOver(
  source: Element,
  target: Element,
  options: DragGestureOptions = {},
): void {
  // Resolve the options against their defaults
  const { clientX = 0, clientY = 0, shiftKey = false } = options;

  // Resolve hit testing to the target
  document.elementFromPoint = () => target;

  // Measure the target
  const targetRect = target.getBoundingClientRect();

  // Check if the target has no size. If so, measure it at the default
  // bounds.
  if (targetRect.width === 0 && targetRect.height === 0) {
    target.getBoundingClientRect = () => DEFAULT_TARGET_RECT;
  }

  // Resolve the press position at the source's centre
  const sourceRect = source.getBoundingClientRect();
  const press = {
    clientX: sourceRect.left + sourceRect.width / 2,
    clientY: sourceRect.top + sourceRect.height / 2,
  };

  // Record the pressed element for the release's click
  lastPress.element = source;

  // Press the source
  fireEvent.pointerDown(source, {
    ...press,
    button: 0,
    buttons: 1,
    isPrimary: true,
    shiftKey,
  });
  fireEvent.mouseDown(source, { ...press, button: 0, buttons: 1, shiftKey });

  // Move past the drag threshold to start the drag
  fireEvent.pointerMove(window, {
    clientX: press.clientX + 10,
    clientY: press.clientY + 10,
    buttons: 1,
  });

  // Move the pointer to the point
  fireEvent.pointerMove(window, { clientX, clientY, buttons: 1 });
}
