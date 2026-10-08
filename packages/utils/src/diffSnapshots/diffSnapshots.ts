import { isDeepEqual } from '../isDeepEqual';

/**
 * The keys which differ between two snapshots.
 */
export interface SnapshotDiff {
  /**
   * Keys present in both snapshots whose values differ.
   */
  modified: string[];

  /**
   * Keys present only in the earlier snapshot.
   */
  deleted: string[];

  /**
   * Keys present only in the later snapshot.
   */
  created: string[];
}

/**
 * Returns the keys whose values were modified, deleted or created
 * between two snapshots of keyed values. Values are compared
 * structurally.
 *
 * @param before - The earlier snapshot.
 * @param after - The later snapshot.
 * @returns The modified, deleted and created keys.
 */
export function diffSnapshots<TValue>(
  before: Record<string, TValue>,
  after: Record<string, TValue>,
): SnapshotDiff {
  // Find the keys in both snapshots whose values differ
  const modified = Object.keys(before).filter(
    (key) => key in after && !isDeepEqual(before[key], after[key]),
  );
  // Find the keys only in the earlier snapshot
  const deleted = Object.keys(before).filter((key) => !(key in after));
  // Find the keys only in the later snapshot
  const created = Object.keys(after).filter((key) => !(key in before));

  return { modified, deleted, created };
}
