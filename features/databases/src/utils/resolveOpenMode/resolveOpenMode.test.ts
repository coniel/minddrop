import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { cleanup, setup } from '../../test-utils';
import { resolveOpenMode } from './resolveOpenMode';

const { objectEntry1 } = DatabaseFixtures;

describe('resolveOpenMode', () => {
  beforeEach(() => {
    setup();

    // Load the entry used to look up the database default
    DatabaseEntries.Store.load([objectEntry1]);
  });

  afterEach(() => {
    cleanup();

    // Clear the entries loaded for the fallback lookup
    DatabaseEntries.Store.clear();
  });

  it('returns the provided open mode when specified', () => {
    // Should use the explicitly provided mode regardless
    // of the database default.
    const result = resolveOpenMode(objectEntry1.id, 'in-place');

    expect(result).toBe('in-place');
  });

  it('falls back to the database entryOpenMode', () => {
    // Set the database's default open mode to 'in-place'
    Databases.Store.update(objectEntry1.database, {
      entryOpenMode: 'in-place',
    });

    // Should return the database's configured open mode
    const result = resolveOpenMode(objectEntry1.id);

    expect(result).toBe('in-place');
  });

  it('defaults to dialog when the entry does not exist', () => {
    const result = resolveOpenMode('non-existent-entry');

    expect(result).toBe('dialog');
  });
});
