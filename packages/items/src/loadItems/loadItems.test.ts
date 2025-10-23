import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemTypesFixtures } from '@minddrop/item-types';
import { ItemsStore } from '../ItemsStore';
import { cleanup, markdownItem1, pdfItem1, setup } from '../test-utils';
import { loadItems } from './loadItems';

const { markdownItemTypeConfig, pdfItemTypeConfig } = ItemTypesFixtures;

describe('loadItems', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads items into the ItemsStore', async () => {
    await loadItems([markdownItemTypeConfig, pdfItemTypeConfig]);

    expect(ItemsStore.get(markdownItem1.path)).toEqual(markdownItem1);
    expect(ItemsStore.get(pdfItem1.path)).toEqual(pdfItem1);
  });

  it('dispatches a items load event', async () =>
    new Promise<void>((done) => {
      Events.addListener('items:load', 'test', (payload) => {
        // Payload data should be the loaded items
        expect(payload.data).toEqual([markdownItem1, pdfItem1]);
        done();
      });

      loadItems([markdownItemTypeConfig, pdfItemTypeConfig]);
    }));
});
