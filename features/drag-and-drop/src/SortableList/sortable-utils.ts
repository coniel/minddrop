export interface ItemRect {
  /**
   * Start position along the drag axis.
   */
  start: number;

  /**
   * Size along the drag axis.
   */
  size: number;
}

/**
 * Determines the insertion index based on how much of each target
 * item is covered by the dragged item. An item shifts when the
 * dragged item overlaps 50% or more of its size.
 *
 * When dragging forward (down/right), uses the dragged item's
 * trailing edge. When dragging backward (up/left), uses its
 * leading edge.
 */
export function calculateOverIndex(
  draggedRect: ItemRect,
  itemRects: ItemRect[],
  draggedOriginalIndex: number,
): number {
  const draggedStart = draggedRect.start;
  const draggedEnd = draggedRect.start + draggedRect.size;

  let overIndex = draggedOriginalIndex;

  // Check items after the dragged item (forward displacement)
  for (
    let index = draggedOriginalIndex + 1;
    index < itemRects.length;
    index++
  ) {
    const target = itemRects[index];
    const threshold = target.start + target.size / 2;

    // The dragged item's trailing edge must pass the target's midpoint
    if (draggedEnd > threshold) {
      overIndex = index;
    } else {
      break;
    }
  }

  // Check items before the dragged item (backward displacement)
  for (let index = draggedOriginalIndex - 1; index >= 0; index--) {
    const target = itemRects[index];
    const threshold = target.start + target.size / 2;

    // The dragged item's leading edge must pass the target's midpoint
    if (draggedStart < threshold) {
      overIndex = index;
    } else {
      break;
    }
  }

  return overIndex;
}

/**
 * Returns a new array with the item at `fromIndex` moved to `toIndex`.
 */
export function reorderArray<T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);

  result.splice(toIndex, 0, removed);

  return result;
}
