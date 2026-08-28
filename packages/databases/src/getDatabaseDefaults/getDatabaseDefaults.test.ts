import { afterEach, describe, expect, it } from 'vitest';
import { DatabaseDefaultsStore } from '../DatabaseDefaultsStore';
import { getDatabaseDefaults } from './getDatabaseDefaults';

describe('getDatabaseDefaults', () => {
  afterEach(() => {
    // Reset configured defaults to their built-in values
    DatabaseDefaultsStore.reset();
  });

  it('returns the built-in defaults', () => {
    expect(getDatabaseDefaults()).toEqual({
      entrySerializer: 'markdown',
      propertyFileStorage: 'property',
      entryOpenMode: 'in-place',
    });
  });

  it('reflects configured values', () => {
    // Configure a default
    DatabaseDefaultsStore.set('entryOpenMode', 'panel');

    expect(getDatabaseDefaults().entryOpenMode).toBe('panel');
  });
});
