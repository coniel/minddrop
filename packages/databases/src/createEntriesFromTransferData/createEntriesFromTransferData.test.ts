import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Properties } from '@minddrop/properties';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { setDatabaseContentDefault } from '../setDatabaseContentDefault';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { updateCustomContentType } from '../updateCustomContentType';
import { createEntriesFromTransferData } from './createEntriesFromTransferData';

const {
  commonStorageDatabase,
  customContentType_url_1,
  entries,
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

describe('createEntriesFromTransferData', () => {
  beforeEach(() => {
    setup();

    // Set a database for every content type the tests transfer
    setDatabaseContentDefault('text', objectDatabase.id);
    setDatabaseContentDefault('url', urlDatabase.id);
    setDatabaseContentDefault('image', rootStorageDatabase.id);
  });

  afterEach(cleanup);

  it('creates entries from files in the file default databases', async () => {
    const [entry] = await createEntriesFromTransferData({
      files: [validImagePropertyFile],
    });

    expect(storeItem(EntriesStore, entry.id).database).toBe(
      rootStorageDatabase.id,
    );
  });

  it('creates an entry per file', async () => {
    await createEntriesFromTransferData({
      files: [validImagePropertyFile, validImagePropertyFile],
    });

    expect(EntriesStore).toHaveItemCount(entries.length + 2);
  });

  it('skips files with no default database', async () => {
    await createEntriesFromTransferData({
      files: [invalidImagePropertyFile],
    });

    expect(EntriesStore).toHaveItems(entries);
  });

  it('skips files whose default database no longer exists', async () => {
    DatabasesStore.remove(rootStorageDatabase.id);

    await createEntriesFromTransferData({
      files: [validImagePropertyFile],
    });

    expect(EntriesStore).toHaveItems(entries);
  });

  it('skips files their default database cannot hold', async () => {
    setDatabaseContentDefault('image', objectDatabase.id);

    await createEntriesFromTransferData({
      files: [validImagePropertyFile],
    });

    expect(EntriesStore).toHaveItems(entries);
  });

  it('creates entries from URLs in the URL default database', async () => {
    const [entry] = await createEntriesFromTransferData({
      urls: ['https://example.com'],
    });

    expect(storeItem(EntriesStore, entry.id).properties[urlProperty.name]).toBe(
      'https://example.com',
    );
  });

  it('creates entries from URLs in their custom content type databases', async () => {
    // Give only the custom type's URLs a database
    setDatabaseContentDefault('url', null);
    updateCustomContentType(customContentType_url_1.id, {
      databaseId: urlDatabase.id,
    });

    const [entry] = await createEntriesFromTransferData({
      urls: [customTypeUrl],
    });

    expect(storeItem(EntriesStore, entry.id).database).toBe(urlDatabase.id);
  });

  it('resolves the database of each URL separately', async () => {
    // Give only the custom type's URLs a database
    setDatabaseContentDefault('url', null);
    updateCustomContentType(customContentType_url_1.id, {
      databaseId: urlDatabase.id,
    });

    const created = await createEntriesFromTransferData({
      urls: [customTypeUrl, 'https://example.com'],
    });

    expect(created).toHaveLength(1);
    expect(
      storeItem(EntriesStore, created[0].id).properties[urlProperty.name],
    ).toBe(customTypeUrl);
  });

  it('creates an entry per URL', async () => {
    await createEntriesFromTransferData({
      urls: ['https://example.com', 'https://example.org'],
    });

    expect(EntriesStore).toHaveItemCount(entries.length + 2);
  });

  it('skips URLs with no default database', async () => {
    setDatabaseContentDefault('url', null);

    await createEntriesFromTransferData({
      urls: ['https://example.com'],
    });

    expect(EntriesStore).toHaveItems(entries);
  });

  it('skips URLs whose default database no longer exists', async () => {
    // Remove the URL database
    DatabasesStore.remove(urlDatabase.id);

    await createEntriesFromTransferData({
      urls: ['https://example.com'],
    });

    expect(EntriesStore).toHaveItems(entries);
  });

  it('skips URLs their default database cannot hold', async () => {
    setDatabaseContentDefault('url', objectDatabase.id);

    await createEntriesFromTransferData({
      urls: ['https://example.com'],
    });

    expect(EntriesStore).toHaveItems(entries);
  });

  it('creates an entry from text in the text default database', async () => {
    const [entry] = await createEntriesFromTransferData({
      'text/plain': 'Hello',
    });

    expect(
      storeItem(EntriesStore, entry.id).properties[contentProperty.name],
    ).toBe('Hello');
  });

  it('trims the text', async () => {
    const [entry] = await createEntriesFromTransferData({
      'text/plain': '  Hello \n',
    });

    expect(
      storeItem(EntriesStore, entry.id).properties[contentProperty.name],
    ).toBe('Hello');
  });

  it('skips blank text', async () => {
    await createEntriesFromTransferData({ 'text/plain': '  \n' });

    expect(EntriesStore).toHaveItems(entries);
  });

  it('skips text its default database cannot hold', async () => {
    setDatabaseContentDefault('text', urlDatabase.id);

    await createEntriesFromTransferData({ 'text/plain': 'Hello' });

    expect(EntriesStore).toHaveItems(entries);
  });

  it('skips text whose default database no longer exists', async () => {
    setDatabaseContentDefault('text', 'missing-database');

    await createEntriesFromTransferData({ 'text/plain': 'Hello' });

    expect(EntriesStore).toHaveItems(entries);
  });

  describe('with a target database', () => {
    it('creates entries in the target from files it can hold', async () => {
      const [entry] = await createEntriesFromTransferData(
        { files: [validImagePropertyFile] },
        commonStorageDatabase.id,
      );

      expect(storeItem(EntriesStore, entry.id).database).toBe(
        commonStorageDatabase.id,
      );
    });

    it('creates entries from files the target cannot hold in their default databases', async () => {
      const [entry] = await createEntriesFromTransferData(
        { files: [validImagePropertyFile] },
        objectDatabase.id,
      );

      expect(storeItem(EntriesStore, entry.id).database).toBe(
        rootStorageDatabase.id,
      );
    });

    it('creates entries in the target from URLs it can hold', async () => {
      // Give URLs no default database
      setDatabaseContentDefault('url', null);

      const [entry] = await createEntriesFromTransferData(
        { urls: ['https://example.com'] },
        urlDatabase.id,
      );

      expect(storeItem(EntriesStore, entry.id).database).toBe(urlDatabase.id);
    });

    it('creates entries from URLs the target cannot hold in their default databases', async () => {
      const [entry] = await createEntriesFromTransferData(
        { urls: ['https://example.com'] },
        objectDatabase.id,
      );

      expect(storeItem(EntriesStore, entry.id).database).toBe(urlDatabase.id);
    });

    it('creates an entry from text in the target when it has a content property', async () => {
      // Give text no default database
      setDatabaseContentDefault('text', null);

      const [entry] = await createEntriesFromTransferData(
        { 'text/plain': 'Hello' },
        objectDatabase.id,
      );

      expect(storeItem(EntriesStore, entry.id).database).toBe(
        objectDatabase.id,
      );
    });

    it('creates entries in their default databases when the target no longer exists', async () => {
      const [entry] = await createEntriesFromTransferData(
        { 'text/plain': 'Hello' },
        'missing-database',
      );

      expect(storeItem(EntriesStore, entry.id).database).toBe(
        objectDatabase.id,
      );
    });

    it('creates an entry from text the target cannot hold in the text default database', async () => {
      const [entry] = await createEntriesFromTransferData(
        { 'text/plain': 'Hello' },
        urlDatabase.id,
      );

      expect(storeItem(EntriesStore, entry.id).database).toBe(
        objectDatabase.id,
      );
    });
  });

  it('prefers files over URLs and text', async () => {
    const [entry] = await createEntriesFromTransferData({
      files: [validImagePropertyFile],
      urls: ['https://example.com/image.png'],
      'text/plain': 'https://example.com/image.png',
    });

    expect(EntriesStore).toHaveItemCount(entries.length + 1);
    expect(storeItem(EntriesStore, entry.id).database).toBe(
      rootStorageDatabase.id,
    );
  });

  it('prefers URLs over text', async () => {
    const [entry] = await createEntriesFromTransferData({
      urls: ['https://example.com'],
      'text/plain': 'https://example.com',
    });

    expect(EntriesStore).toHaveItemCount(entries.length + 1);
    expect(storeItem(EntriesStore, entry.id).database).toBe(urlDatabase.id);
  });
});
