import { describe, expect, it } from 'vitest';
import { entityIdType } from './entityIdType';

describe('entityIdType', () => {
  it('extracts the type prefix', () => {
    expect(entityIdType('database-entry_abc-123')).toBe('database-entry');
  });

  it('splits on the first underscore only', () => {
    expect(entityIdType('view_abc_def')).toBe('view');
  });

  it('returns null when there is no underscore', () => {
    expect(entityIdType('abc-123')).toBeNull();
  });

  it('returns null for a leading underscore', () => {
    expect(entityIdType('_abc-123')).toBeNull();
  });
});
