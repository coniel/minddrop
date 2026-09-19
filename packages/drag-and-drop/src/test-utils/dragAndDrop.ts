import { DragGestureOptions } from './DragGestureOptions.types';
import { dragOver } from './dragOver';
import { releaseDrag } from './releaseDrag';

/**
 * Drags an element and drops it on another.
 *
 * @param source - The element to drag.
 * @param target - The element to drop it on.
 * @param options - Where the pointer is released, and the keys held.
 */
export function dragAndDrop(
  source: Element,
  target: Element,
  options: DragGestureOptions = {},
): void {
  // Drag the source over the target
  dragOver(source, target, options);
  // Drop it
  releaseDrag(options);
}
