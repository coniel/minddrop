import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ContentViewTypeUnregisteredEvent } from '../events';
import { cleanup, contentViewType_gallery, setup } from '../test-utils';
import { ContentViewTypesRegistry } from './ContentViewTypesRegistry';

describe('ContentViewTypesRegistry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('dispatches the view type unregistered event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        ContentViewTypeUnregisteredEvent,
        'test',
        (payload) => {
          expect(payload).toEqual(contentViewType_gallery);
          done();
        },
      );

      ContentViewTypesRegistry.unregister(contentViewType_gallery.type);
    }));
});
