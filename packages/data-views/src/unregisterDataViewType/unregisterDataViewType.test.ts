import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { DataViewTypeNotRegisteredError } from '../errors';
import { DataViewTypeUnregisteredEvent } from '../events';
import { cleanup, dataViewType_gallery, setup } from '../test-utils';
import { unregisterDataViewType } from './unregisterDataViewType';

describe('unregisterDataViewType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the view type is not registered', () => {
    expect(() => unregisterDataViewType('missing')).toThrow(
      DataViewTypeNotRegisteredError,
    );
  });

  it('removes the view type from the store', () => {
    unregisterDataViewType(dataViewType_gallery.type);

    expect(DataViewTypesStore.get(dataViewType_gallery.type)).toBe(null);
  });

  it('dispatches the view type unregistered event', () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewTypeUnregisteredEvent, 'test', (payload) => {
        expect(payload).toEqual(dataViewType_gallery);
        done();
      });

      unregisterDataViewType(dataViewType_gallery.type);
    }));
});
