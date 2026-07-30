import { describe, expect, it } from 'vitest';
import { parseVirtualViewId } from './parseVirtualViewId';

describe('parseVirtualViewId', () => {
  it('parses a valid virtual view ID', () => {
    const result = parseVirtualViewId(
      'Books/Some Book.md:Related:layout-card-1',
    );

    expect(result).toEqual({
      entryId: 'Books/Some Book.md',
      propertyName: 'Related',
      layoutId: 'layout-card-1',
    });
  });

  it('handles entry IDs with multiple path segments', () => {
    const result = parseVirtualViewId(
      'Entry Storage/Sub Dir/Entry.md:Tasks:layout-1',
    );

    expect(result).toEqual({
      entryId: 'Entry Storage/Sub Dir/Entry.md',
      propertyName: 'Tasks',
      layoutId: 'layout-1',
    });
  });

  it('returns null for an invalid ID with no colons', () => {
    expect(parseVirtualViewId('invalid')).toBeNull();
  });

  it('returns null for an invalid ID with only one colon', () => {
    expect(parseVirtualViewId('entry:layout')).toBeNull();
  });
});
