import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import {
  cleanup,
  itemTypeConfigs,
  markdownItemTypeConfig,
  setup,
} from '../test-utils';
import { loadItemTypes } from './loadItemTypes';

describe('loadItemTypes', () => {
  beforeEach(() => setup({ loadItemTypes: false }));

  afterEach(cleanup);

  it('loads item type configs from the file system into the store', async () => {
    await loadItemTypes();

    expect(
      ItemTypeConfigsStore.get(markdownItemTypeConfig.nameSingular),
    ).toEqual(markdownItemTypeConfig);
  });

  it('does not load existing item type configs into the store', async () => {
    // Pre-load the markdown item type config into the store
    ItemTypeConfigsStore.load([markdownItemTypeConfig]);

    await loadItemTypes();

    expect(ItemTypeConfigsStore.getAll().length).toBe(itemTypeConfigs.length);
  });

  it('dispatches a item types load event', async () =>
    new Promise<void>((done) => {
      Events.addListener('item-types:load', 'test', (payload) => {
        // Payload data should be the loaded item type configs
        expect(payload.data).toEqual(itemTypeConfigs);
        done();
      });

      loadItemTypes();
    }));
});
