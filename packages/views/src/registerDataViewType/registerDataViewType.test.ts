import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { ViewTypeRegisteredEvent } from '../events';
import { cleanup, setup, viewType_gallery } from '../test-utils';
import { registerDataViewType } from './registerDataViewType';

describe('registerDataViewType', () => {
  beforeEach(() => setup({ loadViewTypes: false }));

  afterEach(cleanup);

  it('adds the view type to the store', () => {
    registerDataViewType(viewType_gallery);

    expect(DataViewTypesStore.get(viewType_gallery.type)).toEqual(
      viewType_gallery,
    );
  });

  it('dispatches the view type registered event', () =>
    new Promise<void>((done) => {
      Events.addListener(ViewTypeRegisteredEvent, 'test', (payload) => {
        expect(payload.data).toEqual(viewType_gallery);
        done();
      });

      registerDataViewType(viewType_gallery);
    }));
});
