import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { setDatabaseContentDefault } from '../setDatabaseContentDefault';
import {
  cleanup,
  customContentType_file_1,
  customContentType_url_1,
  objectDatabase,
  setup,
  urlDatabase,
} from '../test-utils';
import { updateCustomContentType } from '../updateCustomContentType';
import { unsetDatabaseContentDefaults } from './unsetDatabaseContentDefaults';

describe('unsetDatabaseContentDefaults', () => {
  beforeEach(() => {
    setup();

    // Set content types and custom types to two databases
    setDatabaseContentDefault('text', objectDatabase.id);
    setDatabaseContentDefault('url', urlDatabase.id);
    updateCustomContentType(customContentType_file_1.id, {
      databaseId: objectDatabase.id,
    });
    updateCustomContentType(customContentType_url_1.id, {
      databaseId: urlDatabase.id,
    });
  });

  afterEach(cleanup);

  it('unsets the content types set to the database', () => {
    unsetDatabaseContentDefaults(objectDatabase.id);

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ text: null }),
    );
  });

  it('unsets the database of the custom content types set to it', () => {
    unsetDatabaseContentDefaults(objectDatabase.id);

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({
        customTypes: [
          { ...customContentType_file_1, databaseId: null },
          { ...customContentType_url_1, databaseId: urlDatabase.id },
        ],
      }),
    );
  });

  it('leaves defaults set to other databases untouched', () => {
    unsetDatabaseContentDefaults(objectDatabase.id);

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ url: urlDatabase.id }),
    );
  });
});
