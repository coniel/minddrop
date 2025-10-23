import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemsStore } from '../ItemsStore';
import { ensureItemAssetsDirExists } from '../ensureItemAssetsDirExists';
import { MockFs, cleanup, markdownItem1, pdfItem1, setup } from '../test-utils';
import {
  itemAssetsDirPath,
  itemCorePropertiesFilePath,
  itemUserPropertiesFilePath,
} from '../utils';
import { deleteItem } from './deleteItem';

describe('deleteItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the item from the store', async () => {
    await deleteItem(markdownItem1.path);

    expect(ItemsStore.get(markdownItem1.path)).toBeNull();
  });

  it('moves the item files to the trash', async () => {
    await deleteItem(markdownItem1.path);

    expect(MockFs.existsInTrash(markdownItem1.path)).toBe(true);
  });

  it('deletes the core properties file', async () => {
    const corePropertiesPath = itemCorePropertiesFilePath(markdownItem1.path);

    await deleteItem(markdownItem1.path);

    expect(MockFs.exists(corePropertiesPath)).toBe(false);
  });

  it('deletes the user properties file', async () => {
    const userPropertiesPath = itemUserPropertiesFilePath(pdfItem1.path);

    await deleteItem(pdfItem1.path);

    expect(MockFs.exists(userPropertiesPath)).toBe(false);
  });

  it('deletes the item assets directory if it exists', async () => {
    const assetsDirPath = itemAssetsDirPath(markdownItem1.path);

    // Create the assets directory for markdownItem1
    await ensureItemAssetsDirExists(markdownItem1.path);

    await deleteItem(markdownItem1.path);

    expect(MockFs.exists(assetsDirPath)).toBe(false);
  });

  it('dispatches a item update event', async () =>
    new Promise<void>((done) => {
      Events.addListener('items:item:delete', 'test', (payload) => {
        // Payload data should be the deleted item
        expect(payload.data).toEqual(markdownItem1);
        done();
      });

      deleteItem(markdownItem1.path);
    }));
});
