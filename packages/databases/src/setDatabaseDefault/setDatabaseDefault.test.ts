// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { DatabaseDefaultsStore } from '../DatabaseDefaultsStore';
import { setDatabaseDefault } from './setDatabaseDefault';

describe('setDatabaseDefault', () => {
  afterEach(() => {
    // Reset configured defaults to their built-in values
    DatabaseDefaultsStore.reset();
  });

  it('sets the given default', () => {
    setDatabaseDefault('propertyFileStorage', 'entry');

    expect(DatabaseDefaultsStore).toHaveStoredValue(
      'propertyFileStorage',
      'entry',
    );
  });

  it('leaves other defaults untouched', () => {
    setDatabaseDefault('entryOpenMode', 'panel');

    expect(DatabaseDefaultsStore).toHaveStoredValue(
      'entrySerializer',
      'markdown',
    );
    expect(DatabaseDefaultsStore).toHaveStoredValue(
      'propertyFileStorage',
      'property',
    );
  });
});
