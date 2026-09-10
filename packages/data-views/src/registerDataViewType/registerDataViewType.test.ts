import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewTypesRegistry } from '../DataViewTypesRegistry';
import { DataViewTypeRegisteredEvent } from '../events';
import { cleanup, dataViewType_gallery, setup } from '../test-utils';
import { registerDataViewType } from './registerDataViewType';

describe('registerDataViewType', () => {
  beforeEach(() => setup({ loadViewTypes: false }));

  afterEach(cleanup);

  it('registers the view type', () => {
    registerDataViewType(dataViewType_gallery);

    expect(DataViewTypesRegistry.store).toHaveItem(
      dataViewType_gallery.type,
      dataViewType_gallery,
    );
  });

  it('dispatches the view type registered event', () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewTypeRegisteredEvent, 'test', (payload) => {
        expect(payload).toEqual(dataViewType_gallery);
        done();
      });

      registerDataViewType(dataViewType_gallery);
    }));
});
