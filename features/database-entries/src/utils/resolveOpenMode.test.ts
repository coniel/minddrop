import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { cleanup, setup } from '../test-utils';
import { resolveOpenMode } from './resolveOpenMode';

const { objectEntry1 } = DatabaseFixtures;

describe('resolveOpenMode', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns the provided open mode when specified', () => {
    // Should use the explicitly provided mode regardless
    // of the database default.
    const result = resolveOpenMode(objectEntry1.id, 'main-content');

    expect(result).toBe('main-content');
  });

  it('falls back to the database entryOpenMode', () => {
    // Set the database's default open mode to 'main-content'
    Databases.Store.update(objectEntry1.database, {
      entryOpenMode: 'main-content',
    });

    // Should return the database's configured open mode
    const result = resolveOpenMode(objectEntry1.id);

    expect(result).toBe('main-content');
  });

  it('defaults to dialog when the entry does not exist', () => {
    const result = resolveOpenMode('non-existent-entry');

    expect(result).toBe('dialog');
  });
});
