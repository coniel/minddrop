import { describe, expect, it } from 'vitest';
import { DefaultSplitRatio } from '../../constants';
import { SessionHistoryEntry } from '../../types';
import { pruneHistoryEntries } from './pruneHistoryEntries';

function entry(
  mainId: string | null,
  splitId: string | null = null,
): SessionHistoryEntry {
  return {
    main: mainId ? { view: 'db:view', id: mainId, contentIcon: 'icon' } : null,
    split: splitId
      ? { view: 'db:view', id: splitId, contentIcon: 'icon' }
      : null,
    splitRatio: 60,
  };
}

describe('pruneHistoryEntries', () => {
  it('drops entries whose main pane matches', () => {
    const pruned = pruneHistoryEntries(
      [entry('db:a'), entry('db:b'), entry('db:c')],
      'db:b',
    );

    expect(pruned).toHaveLength(2);
    expect(pruned.map((prunedEntry) => prunedEntry.main?.id)).toEqual([
      'db:a',
      'db:c',
    ]);
  });

  it('clears the split of entries whose split pane matches', () => {
    const pruned = pruneHistoryEntries([entry('db:a', 'db:b')], 'db:b');

    expect(pruned[0].main?.id).toBe('db:a');
    expect(pruned[0].split).toBeNull();
    expect(pruned[0].splitRatio).toBe(DefaultSplitRatio);
  });

  it('collapses adjacent entries left showing the same views', () => {
    const pruned = pruneHistoryEntries(
      [entry('db:a'), entry('db:a', 'db:b'), entry('db:c')],
      'db:b',
    );

    expect(pruned).toHaveLength(2);
    expect(pruned.map((prunedEntry) => prunedEntry.main?.id)).toEqual([
      'db:a',
      'db:c',
    ]);
  });

  it('returns the original array when nothing matches', () => {
    const entries = [entry('db:a'), entry('db:b')];

    expect(pruneHistoryEntries(entries, 'db:other')).toBe(entries);
  });
});
