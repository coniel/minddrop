import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { storeItem } from '@minddrop/stores/test-utils';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { cleanup, objectDatabase, setup, urlDatabase } from '../test-utils';
import { createDatabaseEntryFromText } from './createDatabaseEntryFromText';

// The object database's content property
const contentProperty = objectDatabase.properties.find(Properties.isContent)!;

describe('createDatabaseEntryFromText', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database has no content property', async () => {
    await expect(() =>
      createDatabaseEntryFromText(urlDatabase.id, 'Hello'),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('creates an entry with the text as its content', async () => {
    const entry = await createDatabaseEntryFromText(
      objectDatabase.id,
      'Shopping list\nMilk',
    );

    expect(
      storeItem(DatabaseEntriesStore, entry.id).properties[
        contentProperty.name
      ],
    ).toBe('Shopping list\nMilk');
  });

  it('leaves the entry untitled', async () => {
    const entry = await createDatabaseEntryFromText(
      objectDatabase.id,
      'Shopping list\nMilk',
    );

    expect(storeItem(DatabaseEntriesStore, entry.id).title).toBe(
      i18n.t('labels.untitled'),
    );
  });
});
