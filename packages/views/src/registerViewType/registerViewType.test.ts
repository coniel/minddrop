import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewTypesStore } from '../ViewTypesStore';
import { ViewTypeRegisteredEvent } from '../events';
import { cleanup, setup, viewType1 } from '../test-utils';
import { registerViewType } from './registerViewType';

describe('registerViewType', () => {
  beforeEach(() => setup({ loadViewTypes: false }));

  afterEach(cleanup);

  it('adds the view type to the store', () => {
    registerViewType(viewType1);

    expect(ViewTypesStore.get(viewType1.type)).toEqual(viewType1);
  });

  it('dispatches the view type registered event', () =>
    new Promise<void>((done) => {
      Events.addListener(ViewTypeRegisteredEvent, 'test', (payload) => {
        expect(payload.data).toEqual(viewType1);
        done();
      });

      registerViewType(viewType1);
    }));
});
