import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  dataViewType_gallery,
  mockDate,
  setup,
} from '../test-utils';
import { DataView } from '../types';
import { resolveViewFilePath, toContentIcon } from '../utils';
import { createDataView } from './createDataView';

const newView: DataView = {
  id: expect.any(String),
  name: dataViewType_gallery.name,
  type: dataViewType_gallery.type,
  icon: toContentIcon(dataViewType_gallery.icon),
  created: mockDate,
  lastModified: mockDate,
  dataSource: {
    type: 'database',
    id: 'database-1',
  },
  options: {
    ...dataViewType_gallery.defaultOptions,
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
      dataViewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(result).toEqual(newView);
  });

  it('adds the view to the store', async () => {
    const result = await createDataView(
      dataViewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(DataViewsStore.get(result.id)).toEqual(newView);
  });

  it('writes the view to the file system', async () => {
    const view = await createDataView(
      dataViewType_gallery.type,
      newView.dataSource,
      newView.name,
    );

    expect(MockFs.readJsonFile(resolveViewFilePath(view.id))).toMatchObject(
      writtenView,
    );
  });

  it('dispatches a view created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewCreatedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(newView);
        done();
      });

      createDataView(
        dataViewType_gallery.type,
        newView.dataSource,
        newView.name,
      );
    }));
});
