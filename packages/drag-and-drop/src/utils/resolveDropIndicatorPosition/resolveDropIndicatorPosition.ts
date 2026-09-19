import { DropIndicatorPosition, DropPosition } from '../../types';

/**
 * Resolves the indicator position for a drop position. A drop before
 * the first item of a list resolves to 'start' and a drop after its
 * last to 'end'. Any other drop resolves to the position itself.
 *
 * @param position - The drop position.
 * @param index - The target's index in its list, if it is an item of one.
 * @param isLastChild - Whether the target is the last item of its list.
 * @returns The indicator position.
 */
export function resolveDropIndicatorPosition(
  position: DropPosition,
  index?: number,
  isLastChild = false,
): DropIndicatorPosition {
  // Resolve a drop before the first item to the list's start
  if (position === 'before' && index === 0) {
    return 'start';
  }

  // Resolve a drop after the last item to the list's end
  if (position === 'after' && isLastChild) {
    return 'end';
  }

  // Resolve any other drop to the position itself
  return position;
}
