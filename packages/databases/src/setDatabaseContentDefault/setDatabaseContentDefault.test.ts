import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { cleanup, objectDatabase, setup, urlDatabase } from '../test-utils';
import { setDatabaseContentDefault } from './setDatabaseContentDefault';

describe('setDatabaseContentDefault', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the database for the content type', () => {
    setDatabaseContentDefault('text', objectDatabase.id);

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ text: objectDatabase.id }),
    );
  });

  it('unsets the database for the content type', () => {
    setDatabaseContentDefault('url', urlDatabase.id);

    setDatabaseContentDefault('url', null);

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ url: null }),
    );
  });

  it('leaves other content types untouched', () => {
    setDatabaseContentDefault('url', urlDatabase.id);

    setDatabaseContentDefault('text', objectDatabase.id);

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ url: urlDatabase.id }),
    );
  });
});
