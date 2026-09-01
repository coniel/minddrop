import { Anchor } from '../../types';

interface Position {
  x: number;
  y: number;
}

/**
 * Returns a point-sized virtual anchor at the coordinates of the
 * event which opened a menu, letting follow-up popovers position
 * themselves where the user clicked rather than against an
 * element.
 *
 * @param event - The event which opened the menu.
 * @returns A virtual anchor element, or null when the event carries no pointer position.
 */
export function resolveEventAnchor(event: Event): Anchor | null {
  const position = resolvePosition(event);

  // Keyboard driven opens carry no position
  if (!position) {
    return null;
  }

  // A zero-sized rect at the point, so the floating element sits
  // against the position itself
  return {
    getBoundingClientRect: () => ({
      x: position.x,
      y: position.y,
      top: position.y,
      bottom: position.y,
      left: position.x,
      right: position.x,
      width: 0,
      height: 0,
    }),
  };
}

/**
 * Returns the viewport coordinates the event occurred at.
 *
 * @param event - The event to read the coordinates from.
 * @returns The coordinates, or null for events without any.
 */
function resolvePosition(event: Event): Position | null {
  // Touch events carry their coordinates on the touch points
  if ('changedTouches' in event) {
    const touch = (event as TouchEvent).changedTouches[0];

    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  if (!('clientX' in event)) {
    return null;
  }

  const { clientX, clientY } = event as MouseEvent;

  // Activating a control by keyboard fires a click event at the
  // viewport origin
  if (clientX === 0 && clientY === 0) {
    return null;
  }

  return { x: clientX, y: clientY };
}
