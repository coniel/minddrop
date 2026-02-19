import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { cleanup, objectDatabase, setup, urlDatabase } from '../test-utils';
import { createDatabaseEntryFromUrl } from './createDatabaseEntryFromUrl';

describe('createDatabaseEntryFromUrl', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not support URLs', async () => {
    await expect(
      createDatabaseEntryFromUrl(objectDatabase.id, 'https://example.com'),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('creates a database entry with the URL', async () => {
    const entry = await createDatabaseEntryFromUrl(
      urlDatabase.id,
      'https://example.com',
    );

    expect(entry.title).toBe('example.com');
    expect(entry.properties).toEqual({
      URL: 'https://example.com',
    });
  });
});
