/**
 * Rounds a value down to the multiple of a snap resolution it falls
 * on, giving the grid square a position lands in rather than the
 * nearest grid line.
 *
 * @param value - The value to round down.
 * @param snap - The snap resolution.
 * @returns The multiple the value falls on.
 */
export function floorToMultiple(value: number, snap: number): number {
  return Math.floor(value / snap) * snap;
}
