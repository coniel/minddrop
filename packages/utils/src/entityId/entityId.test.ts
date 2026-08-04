import { describe, expect, it } from 'vitest';
import { entityId } from './entityId';

describe('entityId', () => {
  it('mints an ID with the type prefix', () => {
    expect(entityId('database-entry')).toMatch(
      /^database-entry_[0-9a-f-]{36}$/,
    );
  });

  it('mints unique IDs', () => {
    expect(entityId('view')).not.toBe(entityId('view'));
  });
});
