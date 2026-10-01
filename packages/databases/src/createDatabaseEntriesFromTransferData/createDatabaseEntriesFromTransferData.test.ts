import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Properties } from '@minddrop/properties';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { setDatabaseContentDefault } from '../setDatabaseContentDefault';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { updateCustomContentType } from '../updateCustomContentType';
import { createDatabaseEntriesFromTransferData } from './createDatabaseEntriesFromTransferData';

const {
  commonStorageDatabase,
  customContentType_url_1,
  databaseEntries,
  invalidImagePropertyFile,
  objectDatabase,
  rootStorageDatabase,
  urlDatabase,
  validImagePropertyFile,
} = DatabaseFixtures;

// The object database's content property
const contentProperty = objectDatabase.properties.find(Properties.isContent)!;
// The URL database's URL property
const urlProperty = urlDatabase.properties.find(Properties.isUrl)!;
// A URL on a domain the custom URL type lists
const customTypeUrl = `https://${customContentType_url_1.matchers[0]}/foo`;

describe('createDatabaseEntriesFromTransferData', () => {
  beforeEach(() => {
    setup();

    // Set a database for every content type the tests transfer
    setDatabaseContentDefault('text', objectDatabase.id);
    setDatabaseContentDefault('url', urlDatabase.id);
    setDatabaseContentDefault('image', rootStorageDatabase.id);
  });

  afterEach(cleanup);

  it('creates entries from files in the file default databases', async () => {
    const [entry] = await createDatabaseEntriesFromTransferData({
      files: [validImagePropertyFile],
    });

    expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
      rootStorageDatabase.id,
    );
  });

  it('creates an entry per file', async () => {
    await createDatabaseEntriesFromTransferData({
      files: [validImagePropertyFile, validImagePropertyFile],
    });

    expect(DatabaseEntriesStore).toHaveItemCount(databaseEntries.length + 2);
  });

  it('skips files with no default database', async () => {
    await createDatabaseEntriesFromTransferData({
      files: [invalidImagePropertyFile],
    });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  it('skips files whose default database no longer exists', async () => {
    DatabasesStore.remove(rootStorageDatabase.id);

    await createDatabaseEntriesFromTransferData({
      files: [validImagePropertyFile],
    });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  it('skips files their default database cannot hold', async () => {
    setDatabaseContentDefault('image', objectDatabase.id);

    await createDatabaseEntriesFromTransferData({
      files: [validImagePropertyFile],
    });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  it('creates entries from URLs in the URL default database', async () => {
    const [entry] = await createDatabaseEntriesFromTransferData({
      urls: ['https://example.com'],
    });

    expect(
      storeItem(DatabaseEntriesStore, entry.id).properties[urlProperty.name],
    ).toBe('https://example.com');
  });

  it('creates entries from URLs in their custom content type databases', async () => {
    // Give only the custom type's URLs a database
    setDatabaseContentDefault('url', null);
    updateCustomContentType(customContentType_url_1.id, {
      databaseId: urlDatabase.id,
    });

    const [entry] = await createDatabaseEntriesFromTransferData({
      urls: [customTypeUrl],
    });

    expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
      urlDatabase.id,
    );
  });

  it('resolves the database of each URL separately', async () => {
    // Give only the custom type's URLs a database
    setDatabaseContentDefault('url', null);
    updateCustomContentType(customContentType_url_1.id, {
      databaseId: urlDatabase.id,
    });

    const entries = await createDatabaseEntriesFromTransferData({
      urls: [customTypeUrl, 'https://example.com'],
    });

    expect(entries).toHaveLength(1);
    expect(
      storeItem(DatabaseEntriesStore, entries[0].id).properties[
        urlProperty.name
      ],
    ).toBe(customTypeUrl);
  });

  it('creates an entry per URL', async () => {
    await createDatabaseEntriesFromTransferData({
      urls: ['https://example.com', 'https://example.org'],
    });

    expect(DatabaseEntriesStore).toHaveItemCount(databaseEntries.length + 2);
  });

  it('skips URLs with no default database', async () => {
    setDatabaseContentDefault('url', null);

    await createDatabaseEntriesFromTransferData({
      urls: ['https://example.com'],
    });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  it('skips URLs whose default database no longer exists', async () => {
    // Remove the URL database
    DatabasesStore.remove(urlDatabase.id);

    await createDatabaseEntriesFromTransferData({
      urls: ['https://example.com'],
    });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  it('skips URLs their default database cannot hold', async () => {
    setDatabaseContentDefault('url', objectDatabase.id);

    await createDatabaseEntriesFromTransferData({
      urls: ['https://example.com'],
    });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  it('creates an entry from text in the text default database', async () => {
    const [entry] = await createDatabaseEntriesFromTransferData({
      'text/plain': 'Hello',
    });

    expect(
      storeItem(DatabaseEntriesStore, entry.id).properties[
        contentProperty.name
      ],
    ).toBe('Hello');
  });

  it('trims the text', async () => {
    const [entry] = await createDatabaseEntriesFromTransferData({
      'text/plain': '  Hello \n',
    });

    expect(
      storeItem(DatabaseEntriesStore, entry.id).properties[
        contentProperty.name
      ],
    ).toBe('Hello');
  });

  it('skips blank text', async () => {
    await createDatabaseEntriesFromTransferData({ 'text/plain': '  \n' });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  it('skips text its default database cannot hold', async () => {
    setDatabaseContentDefault('text', urlDatabase.id);

    await createDatabaseEntriesFromTransferData({ 'text/plain': 'Hello' });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  it('skips text whose default database no longer exists', async () => {
    setDatabaseContentDefault('text', 'missing-database');

    await createDatabaseEntriesFromTransferData({ 'text/plain': 'Hello' });

    expect(DatabaseEntriesStore).toHaveItems(databaseEntries);
  });

  describe('with a target database', () => {
    it('creates entries in the target from files it can hold', async () => {
      const [entry] = await createDatabaseEntriesFromTransferData(
        { files: [validImagePropertyFile] },
        commonStorageDatabase.id,
      );

      expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
        commonStorageDatabase.id,
      );
    });

    it('creates entries from files the target cannot hold in their default databases', async () => {
      const [entry] = await createDatabaseEntriesFromTransferData(
        { files: [validImagePropertyFile] },
        objectDatabase.id,
      );

      expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
        rootStorageDatabase.id,
      );
    });

    it('creates entries in the target from URLs it can hold', async () => {
      // Give URLs no default database
      setDatabaseContentDefault('url', null);

      const [entry] = await createDatabaseEntriesFromTransferData(
        { urls: ['https://example.com'] },
        urlDatabase.id,
      );

      expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
        urlDatabase.id,
      );
    });

    it('creates entries from URLs the target cannot hold in their default databases', async () => {
      const [entry] = await createDatabaseEntriesFromTransferData(
        { urls: ['https://example.com'] },
        objectDatabase.id,
      );

      expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
        urlDatabase.id,
      );
    });

    it('creates an entry from text in the target when it has a content property', async () => {
      // Give text no default database
      setDatabaseContentDefault('text', null);

      const [entry] = await createDatabaseEntriesFromTransferData(
        { 'text/plain': 'Hello' },
        objectDatabase.id,
      );

      expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
        objectDatabase.id,
      );
    });

    it('creates entries in their default databases when the target no longer exists', async () => {
      const [entry] = await createDatabaseEntriesFromTransferData(
        { 'text/plain': 'Hello' },
        'missing-database',
      );

      expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
        objectDatabase.id,
      );
    });

    it('creates an entry from text the target cannot hold in the text default database', async () => {
      const [entry] = await createDatabaseEntriesFromTransferData(
        { 'text/plain': 'Hello' },
        urlDatabase.id,
      );

      expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
        objectDatabase.id,
      );
    });
  });

  it('prefers files over URLs and text', async () => {
    const [entry] = await createDatabaseEntriesFromTransferData({
      files: [validImagePropertyFile],
      urls: ['https://example.com/image.png'],
      'text/plain': 'https://example.com/image.png',
    });

    expect(DatabaseEntriesStore).toHaveItemCount(databaseEntries.length + 1);
    expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
      rootStorageDatabase.id,
    );
  });

  it('prefers URLs over text', async () => {
    const [entry] = await createDatabaseEntriesFromTransferData({
      urls: ['https://example.com'],
      'text/plain': 'https://example.com',
    });

    expect(DatabaseEntriesStore).toHaveItemCount(databaseEntries.length + 1);
    expect(storeItem(DatabaseEntriesStore, entry.id).database).toBe(
      urlDatabase.id,
    );
  });
});
