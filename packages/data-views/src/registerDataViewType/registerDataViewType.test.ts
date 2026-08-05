import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { DataViewTypeRegisteredEvent } from '../events';
import { cleanup, dataViewType_gallery, setup } from '../test-utils';
import { registerDataViewType } from './registerDataViewType';

describe('registerDataViewType', () => {
  beforeEach(() => setup({ loadViewTypes: false }));

  afterEach(cleanup);

  it('adds the view type to the store', () => {
    registerDataViewType(dataViewType_gallery);

    expect(DataViewTypesStore.get(dataViewType_gallery.type)).toEqual(
      dataViewType_gallery,
    );
  });

  it('dispatches the view type registered event', () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewTypeRegisteredEvent, 'test', (payload) => {
        expect(payload.data).toEqual(dataViewType_gallery);
        done();
      });

      registerDataViewType(dataViewType_gallery);
    }));
});
