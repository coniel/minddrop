import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  queriesView1,
  setup,
  viewsBasePath,
} from '../test-utils';
import { createView } from './createView';

const createdView = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  type: 'list',
  contentType: 'entry',
  content: [],
  name: 'View',
  path: `${viewsBasePath}/View.view`,
};

describe('createView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a view', async () => {
    const view = await createView('list', 'entry');

    expect(view).toEqual(createdView);
  });

  it('adds the view to the store', async () => {
    const view = await createView('list', 'entry');

    expect(ViewsStore.get(view.id)).toEqual(createdView);
  });

  it('writes the view config to the file system', async () => {
    await createView('list', 'entry');

    expect(MockFs.exists(queriesView1.path)).toBe(true);
  });

  it('increments the view name if necessary', async () => {
    // Create a view with a name that already exists
    const view = await createView('list', 'entry');
    // Create a view with a name that does not already exist
    const view2 = await createView('list', 'entry');

    expect(view.name).toBe('View');
    expect(view2.name).toBe('View 1');
  });

  it('dispatches the view created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ViewCreatedEvent, 'test-view-created', (payload) => {
        expect(payload.data).toEqual(createdView);
        done();
      });

      createView('list', 'entry');
    }));
});
