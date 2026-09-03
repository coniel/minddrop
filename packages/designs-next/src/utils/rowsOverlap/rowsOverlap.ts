import { BlockElement } from '../../types';

/**
 * Checks whether two elements overlap vertically.
 *
 * @param a - The first element.
 * @param b - The second element.
 * @returns True when the elements share at least one row.
 */
export function rowsOverlap(a: BlockElement, b: BlockElement): boolean {
  return a.row < b.row + b.rowSpan && b.row < a.row + a.rowSpan;
}
