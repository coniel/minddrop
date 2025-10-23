import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemTypes, ItemTypesFixtures } from '@minddrop/item-types';
import { PropertyMap } from '@minddrop/properties';
import { registerBackendUtilsAdapter, titleFromUrl } from '@minddrop/utils';
import { AssetsDirPath } from '../constants';
import { getItem } from '../getItem';
import { MockFs, setup } from '../test-utils';
import { Item } from '../types';
import { createItemFromUrl } from './createItemFromUrl';

interface UrlItemProperties extends PropertyMap {
  url: string;
  description: string;
}

const { urlItemTypeConfig } = ItemTypesFixtures;

const date = new Date('2024-01-01T00:00:00.000Z');

const url = 'https://example.com/some-page';
const url2 = 'https://example.com/some-page-2';
const title = titleFromUrl(url);
const path = `${ItemTypes.dirPath(urlItemTypeConfig)}/${title}.md`;

const webpageMetadata = {
  title: 'Test title',
  description: 'Test description',
  image: 'https://example.com/image.png',
  icon: 'https://example.com/icon.png',
};

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${webpageMetadata.title}</title>
  <meta name="description" content="${webpageMetadata.description}">
  <meta property="og:image" content="${webpageMetadata.image}">
  <link rel="icon" href="${webpageMetadata.icon}">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
`;

registerBackendUtilsAdapter({
  getWebpageHtml: vi.fn().mockResolvedValue(htmlContent),
  open: vi.fn(),
});

// Note!
// Cleanup is not used for these tests as it causes issues with
// the async item updates.
describe('createItemFromUrl', () => {
  beforeEach(() => {
    setup();

    vi.useFakeTimers().setSystemTime(date);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates an item with the URL as a property', async () => {
    await createItemFromUrl(urlItemTypeConfig.nameSingular, url, true);

    const item = getItem(path);

    expect(item.title).toBe(title);
    expect(item.properties.url).toBe(url);
  });

  it('re-titles the item using the webpage title', () =>
    new Promise<void>((done) => {
      Events.addListener<Item>('items:item:rename', 'test', (payload) => {
        // Using toContain as title will have a numerical suffix because of name conflict
        expect(payload.data.title).toContain(webpageMetadata.title);
        done();
      });

      createItemFromUrl(urlItemTypeConfig.nameSingular, url2);
    }));

  it('updates the item properties, icon, and image using the webpage metadata', () =>
    new Promise<void>((done) => {
      Events.addListener<Item<UrlItemProperties>>(
        'items:item:update',
        'test',
        (payload) => {
          expect(payload.data.properties.description).toEqual(
            webpageMetadata.description,
          );
          expect(payload.data.icon).toBe('asset:icon.png');
          expect(payload.data.image).toBe('image.png');
          // Check that the item's assets were downloaded
          const itemAssetsDirPath = Fs.concatPath(
            ItemTypes.dirPath(ItemTypesFixtures.urlItemTypeConfig),
            AssetsDirPath,
            payload.data.title,
          );
          expect(
            MockFs.exists(Fs.concatPath(itemAssetsDirPath, 'icon.png')),
          ).toBe(true);
          expect(
            MockFs.exists(Fs.concatPath(itemAssetsDirPath, 'image.png')),
          ).toBe(true);
          done();
        },
      );

      createItemFromUrl(urlItemTypeConfig.nameSingular, url);
    }));
});
