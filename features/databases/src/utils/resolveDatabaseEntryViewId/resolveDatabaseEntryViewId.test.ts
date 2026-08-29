import { describe, expect, it } from 'vitest';
import { resolveDatabaseEntryViewId } from './resolveDatabaseEntryViewId';

describe('resolveDatabaseEntryViewId', () => {
  it('resolves the entry view instance id', () => {
    expect(resolveDatabaseEntryViewId('entry-id')).toBe(
      'databases:entry:entry-id',
    );
  });
});
