import { describe, expect, it } from 'vitest';
import { isEntityId } from './isEntityId';

describe('isEntityId', () => {
  it('returns true for a matching type', () => {
    expect(isEntityId('database-entry_abc-123', 'database-entry')).toBe(true);
  });

  it('returns false for a different type', () => {
    expect(isEntityId('view_abc-123', 'database-entry')).toBe(false);
  });

  it('returns false for untyped IDs', () => {
    expect(isEntityId('abc-123', 'view')).toBe(false);
  });
});
