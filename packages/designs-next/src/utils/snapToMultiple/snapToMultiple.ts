/**
 * Rounds a value to the nearest multiple of a snap resolution.
 *
 * @param value - The value to round.
 * @param snap - The snap resolution.
 * @returns The rounded value.
 */
export function snapToMultiple(value: number, snap: number): number {
  return Math.round(value / snap) * snap;
}
