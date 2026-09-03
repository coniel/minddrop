import { DesignElement } from '../../types';

/**
 * Checks whether two elements overlap horizontally.
 *
 * @param a - The first element.
 * @param b - The second element.
 * @returns True when the elements share at least one column.
 */
export function columnsOverlap(a: DesignElement, b: DesignElement): boolean {
  return (
    a.column < b.column + b.columnSpan && b.column < a.column + a.columnSpan
  );
}
