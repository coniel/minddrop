import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { cleanup, entryTemplatesDatabase, setup } from '../test-utils';
import { setDatabaseColorProperty } from './setDatabaseColorProperty';

describe('setDatabaseColorProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not exist', async () => {
    await expect(() =>
      setDatabaseColorProperty('non-existent-db', 'Status'),
    ).rejects.toThrow(DatabaseNotFoundError);
  });

  it('throws if the property does not exist', async () => {
    await expect(() =>
      setDatabaseColorProperty(entryTemplatesDatabase.id, 'Missing'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the property is not a select property', async () => {
    await expect(() =>
      setDatabaseColorProperty(entryTemplatesDatabase.id, 'Notes'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('assigns the color property', async () => {
    await setDatabaseColorProperty(entryTemplatesDatabase.id, 'Status');

    expect(DatabasesStore.get(entryTemplatesDatabase.id)?.colorProperty).toBe(
      'Status',
    );
  });

  it('clears the color property when set to null', async () => {
    await setDatabaseColorProperty(entryTemplatesDatabase.id, 'Status');
    await setDatabaseColorProperty(entryTemplatesDatabase.id, null);

    expect(DatabasesStore.get(entryTemplatesDatabase.id)?.colorProperty).toBe(
      null,
    );
  });
});
