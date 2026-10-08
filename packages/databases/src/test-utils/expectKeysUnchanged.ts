import { expect } from 'vitest';

/**
 * Asserts that every key in a snapshot is still present in a later
 * one with the same value. Keys added since the snapshot are ignored.
 *
 * @param before - The snapshot to compare against.
 * @param after - The later snapshot.
 * @param missingPlaceholder - Stands in for the value of a key missing
 *   from the later snapshot. The failure then names it.
 */
export function expectKeysUnchanged(
  before: Record<string, string>,
  after: Record<string, string>,
  missingPlaceholder: string,
): void {
  // Look up each snapshotted key's current value
  const current = Object.fromEntries(
    Object.keys(before).map((key) => [
      key,
      key in after ? after[key] : missingPlaceholder,
    ]),
  );

  // Expect every snapshotted key to have its snapshotted value
  expect(current).toEqual(before);
}
