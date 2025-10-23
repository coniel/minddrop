import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { ItemsStore } from '../ItemsStore';
import {
  MockFs,
  cleanup,
  markdownCorePropertiesPath,
  markdownItem1,
  setup,
} from '../test-utils';
import { itemAssetsDirPath } from '../utils';
import { renameItem } from './renameItem';

describe('renameItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the name conflicts with an existing item', async () => {
    await expect(
      renameItem(markdownItem1.path, markdownItem1.title),
    ).rejects.toThrow(PathConflictError);
  });

  it("renames the item's prmary file", async () => {
    await renameItem(markdownItem1.path, 'Renamed Item');

    const newPath = `${Fs.parentDirPath(markdownItem1.path)}/Renamed Item.md`;

    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(markdownItem1.path)).toBe(false);
  });

  it('increments the title if a conflict exists and incrementTitleIfConflict is true', async () => {
    const newName = 'Renamed Item';
    const newPath = `${Fs.parentDirPath(markdownItem1.path)}/${newName} 1.md`;

    // Add a conflicting file
    MockFs.addFiles([`${Fs.parentDirPath(markdownItem1.path)}/${newName}.md`]);

    const renamedItem = await renameItem(markdownItem1.path, newName, true);

    expect(renamedItem.title).toBe(`${newName} 1`);
    expect(renamedItem.path).toBe(newPath);
    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(markdownItem1.path)).toBe(false);
  });

  it("renames the item's core properties file", async () => {
    await renameItem(markdownItem1.path, 'Renamed Item');

    const oldPath = `${markdownCorePropertiesPath}/${markdownItem1.title}.yaml`;
    const newPath = `${markdownCorePropertiesPath}/Renamed Item.yaml`;

    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(oldPath)).toBe(false);
  });

  it("renames the item's assets directory", async () => {
    const assetsDirPath = itemAssetsDirPath(markdownItem1.path);

    // Add the item's assets directory
    MockFs.addFiles([assetsDirPath]);

    await renameItem(markdownItem1.path, 'Renamed Item');

    const newAssetsDirPath = itemAssetsDirPath(
      `${Fs.parentDirPath(markdownItem1.path)}/Renamed Item.md`,
    );

    expect(MockFs.exists(newAssetsDirPath)).toBe(true);
    expect(MockFs.exists(assetsDirPath)).toBe(false);
  });

  it('updates the item title, path, and last modified date', async () => {
    const renamedItem = await renameItem(markdownItem1.path, 'Renamed Item');

    expect(renamedItem.title).toBe('Renamed Item');
    expect(renamedItem.path).toBe(
      `${Fs.parentDirPath(markdownItem1.path)}/Renamed Item.md`,
    );
    expect(renamedItem.lastModified.getTime()).toBeGreaterThan(
      markdownItem1.lastModified.getTime(),
    );
  });

  it('updates the item in the store', async () => {
    const renamedItem = await renameItem(markdownItem1.path, 'Renamed Item');

    expect(ItemsStore.get(renamedItem.path)).toEqual(renamedItem);
  });

  it('updates the item core properties file', async () => {
    await renameItem(markdownItem1.path, 'Renamed Item');

    const coreProperties = MockFs.readTextFile(
      `${markdownCorePropertiesPath}/Renamed Item.yaml`,
    );

    expect(Properties.parse(coreProperties).title).toBe('Renamed Item');
  });

  it('dispatches a item rename event', async () =>
    new Promise<void>(async (done) => {
      Events.addListener('items:item:rename', 'test', (payload) => {
        // Payload data should be the renamed item
        expect(payload.data).toEqual({
          ...markdownItem1,
          title: 'Renamed Item',
          path: `${Fs.parentDirPath(markdownItem1.path)}/Renamed Item.md`,
          lastModified: expect.any(Date),
        });
        done();
      });

      renameItem(markdownItem1.path, 'Renamed Item');
    }));
});
