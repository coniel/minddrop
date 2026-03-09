import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewsLoadedEvent, ViewsLoadedEventData } from '../events';
import { cleanup, mockDate, setup } from '../test-utils';
import { loadVirtualViews } from './loadVirtualViews';

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

describe('loadVirtualViews', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('loads virtual views into the store', () => {
    loadVirtualViews(data);

    const view1 = ViewsStore.get('virtual-1');
    const view2 = ViewsStore.get('virtual-2');

    expect(view1).not.toBeNull();
    expect(view2).not.toBeNull();
  });

  it('marks loaded views as virtual', () => {
    loadVirtualViews(data);

    const view = ViewsStore.get('virtual-1');

    expect(view?.virtual).toBe(true);
  });

  it('sets properties from the provided data', () => {
    loadVirtualViews(data);

    const view = ViewsStore.get('virtual-1');

    expect(view?.name).toBe('View 1');
    expect(view?.type).toBe('gallery');
    expect(view?.icon).toBe('layout');
    expect(view?.dataSource).toEqual({
      type: 'database',
      id: 'database-1',
    });
  });

  it('sets created and lastModified dates', () => {
    loadVirtualViews(data);

    const view = ViewsStore.get('virtual-1');

    expect(view?.created).toEqual(mockDate);
    expect(view?.lastModified).toEqual(mockDate);
  });

  it('dispatches a views loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener<ViewsLoadedEventData>(
        ViewsLoadedEvent,
        'test',
        (payload) => {
          expect(payload.data).toHaveLength(2);
          expect(payload.data[0].virtual).toBe(true);
          done();
        },
      );

      loadVirtualViews(data);
    }));
});
