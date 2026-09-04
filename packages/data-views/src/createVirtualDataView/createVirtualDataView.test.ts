import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewCreatedEvent } from '../events';
import { cleanup, dataViewType_gallery, mockDate, setup } from '../test-utils';
import { toContentIcon } from '../utils';
import { createVirtualDataView } from './createVirtualDataView';

const id = 'virtual-view-1';
const dataSource = { type: 'database' as const, id: 'database-1' };
const owner = 'database_owner-1' as const;

const expectedView = {
  id,
  virtual: true,
  owner,
  name: dataViewType_gallery.type,
  type: dataViewType_gallery.type,
  icon: toContentIcon(dataViewType_gallery.icon),
  dataSource,
  created: mockDate,
  lastModified: mockDate,
  options: { ...dataViewType_gallery.defaultOptions },
  references: [],
};

describe('createVirtualDataView', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('returns the new virtual view', () => {
    const result = createVirtualDataView({
      id,
      type: dataViewType_gallery.type,
      dataSource,
      owner,
    });

    expect(result).toEqual(expectedView);
  });

  it('adds the view to the store', () => {
    createVirtualDataView({
      id,
      type: dataViewType_gallery.type,
      dataSource,
      owner,
    });

    expect(DataViewsStore.get(id)).toEqual(expectedView);
  });

  it('uses the provided name', () => {
    const result = createVirtualDataView({
      id,
      type: dataViewType_gallery.type,
      dataSource,
      owner,
      name: 'Custom Name',
    });

    expect(result.name).toBe('Custom Name');
  });

  it('merges provided options over default options', () => {
    const result = createVirtualDataView({
      id,
      type: dataViewType_gallery.type,
      dataSource,
      owner,
      options: { sortProperty: 'Rating' },
    });

    expect(result.options).toEqual({
      ...dataViewType_gallery.defaultOptions,
      sortProperty: 'Rating',
    });
  });

  it('sets the owner key when provided', () => {
    const result = createVirtualDataView({
      id,
      type: dataViewType_gallery.type,
      dataSource,
      owner,
      ownerKey: 'layout_1:Related',
    });

    expect(result.ownerKey).toBe('layout_1:Related');
    expect(DataViewsStore.get(id)?.ownerKey).toBe('layout_1:Related');
  });

  it('sets provided data on the view', () => {
    const result = createVirtualDataView({
      id,
      type: dataViewType_gallery.type,
      dataSource,
      owner,
      data: { sortOrder: 'asc' },
    });

    expect(result.data).toEqual({ sortOrder: 'asc' });
  });

  it('dispatches a view created event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        DataViewCreatedEvent,
        'test-virtual-created',
        (payload) => {
          expect(payload).toEqual(expectedView);
          done();
        },
      );

      createVirtualDataView({
        id,
        type: dataViewType_gallery.type,
        dataSource,
        owner,
      });
    }));
});
