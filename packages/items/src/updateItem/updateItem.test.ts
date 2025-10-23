import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ItemsStore } from '../ItemsStore';
import { ItemNotFoundError } from '../errors';
import { MockFs, cleanup, markdownItem1, setup } from '../test-utils';
import { updateItem } from './updateItem';

describe('updateItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('should update the item with the provided data', async () => {
    const item = await updateItem(markdownItem1.path, {
      markdown: 'Updated markdown content',
      image: 'updated-image.png',
      icon: 'emoji:😊:0',
      properties: {
        foo: 'new value',
      },
    });

    expect(item.markdown).toBe('Updated markdown content');
    expect(item.image).toBe('updated-image.png');
    expect(item.icon).toBe('emoji:😊:0');
    expect(item.properties.foo).toBe('new value');
  });

  it('throws if the item does not exist', async () => {
    await expect(
      updateItem('/non/existent/item.md', {
        markdown: 'Updated markdown content',
      }),
    ).rejects.toThrowError(ItemNotFoundError);
  });

  it('throws if the update data contains a title', async () => {
    await expect(
      updateItem(markdownItem1.path, {
        // @ts-expect-error Testing invalid data
        title: 'New Title',
      }),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('updates the last modified date', async () => {
    const item = await updateItem(markdownItem1.path, {
      markdown: 'Updated markdown content',
    });

    expect(item.lastModified.getTime()).toBeGreaterThan(
      markdownItem1.lastModified.getTime(),
    );
  });

  it('updates the item in the store', async () => {
    const item = await updateItem(markdownItem1.path, {
      markdown: 'Updated markdown content',
    });

    const storeItem = ItemsStore.get(markdownItem1.path);

    expect(storeItem).toEqual(item);
  });

  it('writes the item files to the file system', async () => {
    // Delete the exisitng item file
    MockFs.removeFile(markdownItem1.path);

    await updateItem(markdownItem1.path, {
      markdown: 'Updated markdown content',
    });

    expect(MockFs.exists(markdownItem1.path)).toBeTruthy();
  });

  it('does nothing if no valid update data is provided', async () => {
    // @ts-expect-error Testing invalid data
    const item = await updateItem(markdownItem1.path, { foo: 'bar' });

    expect(item).toEqual(markdownItem1);
  });

  it('dispatches a item update event', async () =>
    new Promise<void>((done) => {
      Events.addListener('items:item:update', 'test', (payload) => {
        // Payload data should be the updated item
        expect(payload.data).toEqual({
          ...markdownItem1,
          markdown: 'Updated markdown content',
          lastModified: expect.any(Date),
        });
        done();
      });

      updateItem(markdownItem1.path, { markdown: 'Updated markdown content' });
    }));
});
