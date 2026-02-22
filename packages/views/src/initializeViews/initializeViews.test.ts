import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewsLoadedEvent } from '../events';
import { cleanup, setup, views } from '../test-utils';
import { initializeViews } from './initializeViews';

describe('initializeViews', () => {
  beforeEach(() => setup({ loadViews: false }));

  afterEach(cleanup);

  it('loads views into the store', async () => {
    await initializeViews();

    expect(ViewsStore.getAll()).toEqual(views);
  });

  it('dispatches a views loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ViewsLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(views);
        done();
      });

      initializeViews();
    }));
});
