import { PointerMoveListener, PointerPosition } from './types';

// The last position the pointer was seen at during a drag. Kept
// outside React, so every move can update it without a render.
let position: PointerPosition = { x: 0, y: 0 };

// The listeners called on every pointer move
const listeners = new Set<PointerMoveListener>();

/**
 * Returns the last position the pointer was seen at during a drag.
 */
export function getPointerPosition(): PointerPosition {
  return position;
}

/**
 * Records the pointer's position and tells the move listeners.
 *
 * @param x - The horizontal position of the pointer in the viewport.
 * @param y - The vertical position of the pointer in the viewport.
 */
export function updatePointerPosition(x: number, y: number): void {
  // Record the position
  position = { x, y };

  // Tell the move listeners
  listeners.forEach((listener) => listener(position));
}

/**
 * Subscribes to the pointer's moves during a drag.
 *
 * @param listener - Called with the pointer's position on every move.
 * @returns A function which unsubscribes the listener.
 */
export function subscribeToMove(listener: PointerMoveListener): VoidFunction {
  // Add the listener
  listeners.add(listener);

  // Return the unsubscribe function
  return () => {
    listeners.delete(listener);
  };
}
