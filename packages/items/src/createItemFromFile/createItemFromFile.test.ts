import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { ItemTypes, ItemTypesFixtures } from '@minddrop/item-types';
import { ItemsStore } from '../ItemsStore';
import { PropertiesDirName, PropertiesDirPath } from '../constants';
import { getItem } from '../getItem';
import { MockFs, cleanup, pdfItemsDir, setup } from '../test-utils';
import { Item } from '../types';
import { createItemFromFile } from './createItemFromFile';

const date = new Date('2024-01-01T00:00:00Z');
const { pdfItemTypeConfig } = ItemTypesFixtures;
const pdfFile = new File(['%PDF-1.4'], 'New PDF Document.pdf', {
  type: 'application/pdf',
});
const itemPath = `${ItemTypes.dirPath(pdfItemTypeConfig)}/${pdfFile.name}`;
const newItem: Item = {
  type: pdfItemTypeConfig.nameSingular,
  path: itemPath,
  title: 'New PDF Document',
  created: date,
  lastModified: date,
  properties: {},
  markdown: '',
};

describe('createItemFromFile', () => {
  beforeAll(() => {
    // Mock the Date to return a consistent value
    vi.useFakeTimers();
    vi.setSystemTime(date);
  });

  beforeEach(setup);

  afterEach(cleanup);

  afterAll(() => {
    // Restore the original Date implementation
    vi.useRealTimers();
  });

  it('adds the new item to the store', async () => {
    await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);

    const item = ItemsStore.get(itemPath);

    expect(item).toEqual(newItem);
  });

  it('writes the file to the item type directory', async () => {
    await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);

    expect(MockFs.exists(itemPath)).toBe(true);
  });

  it('writes the item to the file system', async () => {
    await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);

    // Properties markdown file should exist
    expect(
      MockFs.exists(`${pdfItemsDir}/${PropertiesDirName}/${newItem.title}.md`),
    ).toBeTruthy();
    // Core properties YAML file should exist
    expect(
      MockFs.exists(
        `${pdfItemsDir}/${PropertiesDirPath}/${newItem.title}.yaml`,
      ),
    ).toBeTruthy();
  });

  describe('when an item with the same name exists', () => {
    it('increments the file name', async () => {
      // Create two items with the same name
      await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);
      await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);

      expect(MockFs.exists(`${pdfItemsDir}/${newItem.title} 1.pdf`)).toBe(true);
    });

    it('increments the item title', async () => {
      // Create two items with the same name
      await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);
      await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);

      const item = getItem(`${pdfItemsDir}/${newItem.title} 1.pdf`);

      expect(item.title).toBe('New PDF Document 1');
    });

    it('writes the item to the file system using the incremented title', async () => {
      // Create two items with the same name
      await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);
      await createItemFromFile(pdfItemTypeConfig.nameSingular, pdfFile);

      // Properties markdown file should exist
      expect(
        MockFs.exists(
          `${pdfItemsDir}/${PropertiesDirName}/${newItem.title} 1.md`,
        ),
      ).toBeTruthy();
      // Core properties YAML file should exist
      expect(
        MockFs.exists(
          `${pdfItemsDir}/${PropertiesDirPath}/${newItem.title} 1.yaml`,
        ),
      ).toBeTruthy();
    });
  });
});
