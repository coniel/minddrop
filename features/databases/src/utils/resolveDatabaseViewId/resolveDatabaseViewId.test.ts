import { describe, expect, it } from 'vitest';
import { resolveDatabaseViewId } from './resolveDatabaseViewId';

describe('resolveDatabaseViewId', () => {
  it('resolves the database view instance id', () => {
    expect(resolveDatabaseViewId('database-id')).toBe(
      'databases:database:database-id',
    );
  });
});
