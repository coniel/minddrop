import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  viewType_gallery,
} from '../test-utils';
import { View } from '../types';
import { getViewFilePath } from '../utils';
import { createView } from './createView';

const newView: View = {
  id: expect.any(String),
  name: viewType_gallery.name,
  type: viewType_gallery.type,
  icon: viewType_gallery.icon,
  created: mockDate,
  lastModified: mockDate,
  dataSource: {
    type: 'database',
    id: 'database-1',
  },
  options: {
    ...viewType_gallery.defaultOptions,
  },
};

describe('createView', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('returns the new view', async () => {
    const result = await createView(
      viewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(result).toEqual(newView);
  });

  it('adds the view to the store', async () => {
    const result = await createView(
      viewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(ViewsStore.get(result.id)).toEqual(newView);
  });

  it('writes the view to the file system', async () => {
    const view = await createView(
      viewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(MockFs.readJsonFile(getViewFilePath(view.id))).toMatchObject(
      newView,
    );
  });

  it('dispatches a view created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ViewCreatedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(newView);
        done();
      });

      createView(viewType_gallery.type, newView.dataSource, newView.name);
    }));
});
