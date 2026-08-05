import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewsLoadedEvent, DataViewsLoadedEventData } from '../events';
import { cleanup, mockDate, setup } from '../test-utils';
import { loadVirtualDataViews } from './loadVirtualDataViews';

const data = [
  {
    id: 'virtual-1',
    type: 'gallery',
    name: 'View 1',
    icon: 'layout',
    dataSource: { type: 'database' as const, id: 'database-1' },
  },
  {
    id: 'virtual-2',
    type: 'board',
    name: 'View 2',
    icon: 'columns',
    dataSource: { type: 'database' as const, id: 'database-2' },
  },
];

describe('loadVirtualDataViews', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('loads virtual views into the store', () => {
    loadVirtualDataViews(data);

    const view1 = DataViewsStore.get('virtual-1');
    const view2 = DataViewsStore.get('virtual-2');

    expect(view1).not.toBeNull();
    expect(view2).not.toBeNull();
  });

  it('marks loaded views as virtual', () => {
    loadVirtualDataViews(data);

    const view = DataViewsStore.get('virtual-1');

    expect(view?.virtual).toBe(true);
  });

  it('sets properties from the provided data', () => {
    loadVirtualDataViews(data);

    const view = DataViewsStore.get('virtual-1');

    expect(view?.name).toBe('View 1');
    expect(view?.type).toBe('gallery');
    expect(view?.icon).toBe('layout');
    expect(view?.dataSource).toEqual({
      type: 'database',
      id: 'database-1',
    });
  });

  it('sets created and lastModified dates', () => {
    loadVirtualDataViews(data);

    const view = DataViewsStore.get('virtual-1');

    expect(view?.created).toEqual(mockDate);
    expect(view?.lastModified).toEqual(mockDate);
  });

  it('dispatches a views loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener<DataViewsLoadedEventData>(
        DataViewsLoadedEvent,
        'test',
        (payload) => {
          expect(payload.data).toHaveLength(2);
          expect(payload.data[0].virtual).toBe(true);
          done();
        },
      );

      loadVirtualDataViews(data);
    }));
});
