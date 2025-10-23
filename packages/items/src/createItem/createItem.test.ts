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
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { ItemTypes, ItemTypesFixtures } from '@minddrop/item-types';
import { ItemsStore } from '../ItemsStore';
import { PropertiesDirPath } from '../constants';
import { MockFs, cleanup, markdownItemsDir, setup } from '../test-utils';
import { Item } from '../types';
import { createItem } from './createItem';

const title = i18n.t('labels.untitled');
const date = new Date('2024-01-01T00:00:00Z');
const { markdownItemTypeConfig } = ItemTypesFixtures;
const itemPath = `${ItemTypes.dirPath(markdownItemTypeConfig)}/${title}.md`;
const newItemType = markdownItemTypeConfig.nameSingular;
const newItem: Item = {
  type: newItemType,
  path: itemPath,
  title: title,
  created: date,
  lastModified: date,
  properties: {
    foo: 'bar',
  },
  markdown: '',
};

describe('createItem', () => {
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
    await createItem(newItemType);

    const item = ItemsStore.get(itemPath);

    expect(item).toEqual(newItem);
  });

  it('writes the item files to the file system', async () => {
    await createItem(newItemType);

    // Main file should exist
    expect(MockFs.exists(newItem.path)).toBeTruthy();
    // Core properties YAML file should exist
    expect(
      MockFs.exists(
        `${markdownItemsDir}/${PropertiesDirPath}/${newItem.title}.yaml`,
      ),
    ).toBeTruthy();
  });

  it('increments the item title if an item with the same name exists', async () => {
    // Create two items with the same name
    await createItem(newItemType);
    const secondItem = await createItem(newItemType);

    expect(secondItem.title).toBe(`${title} 1`);
    expect(secondItem.path).toBe(
      `${ItemTypes.dirPath(markdownItemTypeConfig)}/${title} 1.md`,
    );
  });

  it('allows specifying a custom title', async () => {
    const customTitle = 'Custom Title';
    const itemWithCustomTitle = await createItem(newItemType, customTitle);

    expect(itemWithCustomTitle.title).toBe(customTitle);
    expect(itemWithCustomTitle.path).toBe(
      `${ItemTypes.dirPath(markdownItemTypeConfig)}/${customTitle}.md`,
    );
  });

  it('allows specifying custom properties', async () => {
    const customProperties = {
      foo: 'custom value',
      anotherProp: 42,
    };
    const itemWithCustomProperties = await createItem(
      newItemType,
      title,
      customProperties,
    );

    expect(itemWithCustomProperties.properties).toEqual({
      ...newItem.properties,
      ...customProperties,
    });
  });

  it('allows specifying a custom file extension', async () => {
    const customExtension = 'markdown';
    const itemWithCustomExtension = await createItem(
      newItemType,
      title,
      {},
      customExtension,
    );

    expect(itemWithCustomExtension.path).toBe(
      `${ItemTypes.dirPath(
        markdownItemTypeConfig,
      )}/${title}.${customExtension}`,
    );
  });

  it('dispatches a item create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('items:item:create', 'test', (payload) => {
        // Payload data should be the new item
        expect(payload.data).toEqual(newItem);
        done();
      });

      createItem(newItemType);
    }));
});
