import { LayoutBox } from '@minddrop/designs-next';

/**
 * Resolves the key a box of a design's layout tree renders under
 * among its siblings: the element's ID for an element box, the box's
 * type and position otherwise.
 *
 * @param box - The box.
 * @returns The box's key.
 */
export function resolveLayoutBoxKey(box: LayoutBox): string {
  // Key an element box by its element
  if (box.type === 'element') {
    return box.element.id;
  }

  return `${box.type}-${box.row}-${box.column}`;
}
