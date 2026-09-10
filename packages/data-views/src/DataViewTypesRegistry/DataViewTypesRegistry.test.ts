import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewTypeUnregisteredEvent } from '../events';
import { cleanup, dataViewType_gallery, setup } from '../test-utils';
import { DataViewTypesRegistry } from './DataViewTypesRegistry';

describe('DataViewTypesRegistry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('dispatches the view type unregistered event', () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewTypeUnregisteredEvent, 'test', (payload) => {
        expect(payload).toEqual(dataViewType_gallery);
        done();
      });

      DataViewTypesRegistry.unregister(dataViewType_gallery.type);
    }));
});
