import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewTypesStore } from '../ViewTypesStore';
import { ViewTypeRegisteredEvent } from '../events';
import { cleanup, setup, viewType_gallery } from '../test-utils';
import { registerViewType } from './registerViewType';

describe('registerViewType', () => {
  beforeEach(() => setup({ loadViewTypes: false }));

  afterEach(cleanup);

  it('adds the view type to the store', () => {
    registerViewType(viewType_gallery);

    expect(ViewTypesStore.get(viewType_gallery.type)).toEqual(viewType_gallery);
  });

  it('dispatches the view type registered event', () =>
    new Promise<void>((done) => {
      Events.addListener(ViewTypeRegisteredEvent, 'test', (payload) => {
        expect(payload.data).toEqual(viewType_gallery);
        done();
      });

      registerViewType(viewType_gallery);
    }));
});
