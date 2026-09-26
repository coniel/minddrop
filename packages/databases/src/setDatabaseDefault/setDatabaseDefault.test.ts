import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { cleanup, setup } from '../test-utils';
import { setDatabaseDefault } from './setDatabaseDefault';

describe('setDatabaseDefault', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the given default', () => {
    setDatabaseDefault('propertyFileStorage', 'entry');

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'defaults',
      expect.objectContaining({ propertyFileStorage: 'entry' }),
    );
  });

  it('leaves other defaults untouched', () => {
    setDatabaseDefault('entryOpenMode', 'panel');

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'defaults',
      expect.objectContaining({
        entrySerializer: 'markdown',
        propertyFileStorage: 'property',
      }),
    );
  });
});
