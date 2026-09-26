import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDatabaseDefault } from '../setDatabaseDefault';
import { cleanup, setup } from '../test-utils';
import { getDatabaseDefaults } from './getDatabaseDefaults';

describe('getDatabaseDefaults', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the built-in defaults', () => {
    expect(getDatabaseDefaults()).toEqual({
      entrySerializer: 'markdown',
      propertyFileStorage: 'property',
      entryOpenMode: 'in-place',
    });
  });

  it('reflects configured values', () => {
    // Configure a default
    setDatabaseDefault('entryOpenMode', 'panel');

    expect(getDatabaseDefaults().entryOpenMode).toBe('panel');
  });
});
