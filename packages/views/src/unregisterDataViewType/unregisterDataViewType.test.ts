import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { DataViewTypeNotRegisteredError } from '../errors';
import { ViewTypeUnregisteredEvent } from '../events';
import { cleanup, setup, viewType_gallery } from '../test-utils';
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
    unregisterDataViewType(viewType_gallery.type);

    expect(DataViewTypesStore.get(viewType_gallery.type)).toBe(null);
  });

  it('dispatches the view type unregistered event', () =>
    new Promise<void>((done) => {
      Events.addListener(ViewTypeUnregisteredEvent, 'test', (payload) => {
        expect(payload.data).toEqual(viewType_gallery.type);
        done();
      });

      unregisterDataViewType(viewType_gallery.type);
    }));
});
