import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { cleanup, markdownItemTypeConfig, setup } from '../test-utils';
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

  it('dispatches a item types load event', async () =>
    new Promise<void>((done) => {
      Events.addListener('item-types:load', 'test', (payload) => {
        // Payload data should be the loaded item type configs
        expect(payload.data).toEqual([markdownItemTypeConfig]);
        done();
      });

      loadItemTypes();
    }));
});
