import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewsStore } from '../DataViewsStore';
import { ViewCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  viewType_gallery,
} from '../test-utils';
import { DataView } from '../types';
import { getViewFilePath } from '../utils';
import { createDataView } from './createDataView';

const newView: DataView = {
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
  references: [],
};

// The view as written to disk, without the references index
const { references: _references, ...writtenView } = newView;

describe('createDataView', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('returns the new view', async () => {
    const result = await createDataView(
      viewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(result).toEqual(newView);
  });

  it('adds the view to the store', async () => {
    const result = await createDataView(
      viewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(DataViewsStore.get(result.id)).toEqual(newView);
  });

  it('writes the view to the file system', async () => {
    const view = await createDataView(
      viewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(MockFs.readJsonFile(getViewFilePath(view.id))).toMatchObject(
      writtenView,
    );
  });

  it('dispatches a view created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ViewCreatedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(newView);
        done();
      });

      createDataView(viewType_gallery.type, newView.dataSource, newView.name);
    }));
});
