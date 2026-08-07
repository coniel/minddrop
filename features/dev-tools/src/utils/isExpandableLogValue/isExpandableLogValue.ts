/**
 * Checks whether a logged value is rendered as an expandable tree
 * rather than as text.
 *
 * @param value - The logged value to check.
 * @returns Whether the value is expandable.
 */
export function isExpandableLogValue(value: unknown): value is object {
  return (
    value !== null && typeof value === 'object' && !(value instanceof Error)
  );
}
