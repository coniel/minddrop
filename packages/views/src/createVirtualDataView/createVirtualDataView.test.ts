import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewsStore } from '../DataViewsStore';
import { ViewCreatedEvent } from '../events';
import { cleanup, mockDate, setup, viewType_gallery } from '../test-utils';
import { createVirtualDataView } from './createVirtualDataView';

const id = 'virtual-view-1';
const dataSource = { type: 'database' as const, id: 'database-1' };

const expectedView = {
  id,
  virtual: true,
  name: viewType_gallery.type,
  type: viewType_gallery.type,
  icon: viewType_gallery.icon,
  dataSource,
  created: mockDate,
  lastModified: mockDate,
  options: { ...viewType_gallery.defaultOptions },
  references: [],
};

describe('createVirtualDataView', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('returns the new virtual view', () => {
    const result = createVirtualDataView({
      id,
      type: viewType_gallery.type,
      dataSource,
    });

    expect(result).toEqual(expectedView);
  });

  it('adds the view to the store', () => {
    createVirtualDataView({ id, type: viewType_gallery.type, dataSource });

    expect(DataViewsStore.get(id)).toEqual(expectedView);
  });

  it('uses the provided name', () => {
    const result = createVirtualDataView({
      id,
      type: viewType_gallery.type,
      dataSource,
      name: 'Custom Name',
    });

    expect(result.name).toBe('Custom Name');
  });

  it('merges provided options over default options', () => {
    const result = createVirtualDataView({
      id,
      type: viewType_gallery.type,
      dataSource,
      options: { customOption: true },
    });

    expect(result.options).toEqual({
      ...viewType_gallery.defaultOptions,
      customOption: true,
    });
  });

  it('sets provided data on the view', () => {
    const result = createVirtualDataView({
      id,
      type: viewType_gallery.type,
      dataSource,
      data: { sortOrder: 'asc' },
    });

    expect(result.data).toEqual({ sortOrder: 'asc' });
  });

  it('dispatches a view created event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        ViewCreatedEvent,
        'test-virtual-created',
        (payload) => {
          expect(payload.data).toEqual(expectedView);
          done();
        },
      );

      createVirtualDataView({ id, type: viewType_gallery.type, dataSource });
    }));
});
