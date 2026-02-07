import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewUpdatedEvent, ViewUpdatedEventData } from '../events';
import { MockFs, cleanup, queriesView1, setup } from '../test-utils';
import { View } from '../types';
import { updateView } from './updateView';

describe('updateView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates a view', async () => {
    const view = await updateView('query-view-1', {
      name: 'Updated Query View 1',
    });

    expect(view).toEqual({
      ...queriesView1,
      name: 'Updated Query View 1',
    });
  });

  it('updates the view in the store', async () => {
    await updateView('query-view-1', {
      name: 'Updated Query View 1',
    });

    expect(ViewsStore.get('query-view-1')).toEqual({
      ...queriesView1,
      name: 'Updated Query View 1',
    });
  });

  it('writes the view config to the file system', async () => {
    await updateView('query-view-1', {
      name: 'Updated Query View 1',
    });

    expect(MockFs.readJsonFile<View>(queriesView1.path).name).toBe(
      'Updated Query View 1',
    );
  });

  it('dispatches the view updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<ViewUpdatedEventData>(
        ViewUpdatedEvent,
        'test-view-updated',
        (payload) => {
          expect(payload.data.original).toEqual(queriesView1);
          expect(payload.data.updated).toEqual({
            ...queriesView1,
            name: 'Updated Query View 1',
          });
          done();
        },
      );

      updateView('query-view-1', {
        name: 'Updated Query View 1',
      });
    }));
});
