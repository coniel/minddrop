import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewTypesStore } from '../ViewTypesStore';
import { ViewTypeNotRegisteredError } from '../errors';
import { ViewTypeUnregisteredEvent } from '../events';
import { cleanup, setup, viewType1 } from '../test-utils';
import { unregisterViewType } from './unregisterViewType';

describe('unregisterViewType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the view type is not registered', () => {
    expect(() => unregisterViewType('missing')).toThrow(
      ViewTypeNotRegisteredError,
    );
  });

  it('removes the view type from the store', () => {
    unregisterViewType(viewType1.type);

    expect(ViewTypesStore.get(viewType1.type)).toBe(null);
  });

  it('dispatches the view type unregistered event', () =>
    new Promise<void>((done) => {
      Events.addListener(ViewTypeUnregisteredEvent, 'test', (payload) => {
        expect(payload.data).toEqual(viewType1.type);
        done();
      });

      unregisterViewType(viewType1.type);
    }));
});
