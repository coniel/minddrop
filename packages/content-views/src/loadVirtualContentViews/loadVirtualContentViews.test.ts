import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewsLoadedEvent } from '../events';
import { cleanup, mockDate, setup } from '../test-utils';
import { loadVirtualContentViews } from './loadVirtualContentViews';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

const data = [
  {
    id: 'virtual-1',
    type: 'gallery',
    name: 'View 1',
    icon: 'layout',
    dataSource: { type: 'database' as const, id: 'database-1' },
    owner: 'database_owner-1' as const,
    ownerKey: 'layout_1:Related',
  },
  {
    id: 'virtual-2',
    type: 'board',
    name: 'View 2',
    icon: 'columns',
    dataSource: { type: 'database' as const, id: 'database-2' },
  },
];

describe('loadVirtualContentViews', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('loads virtual views into the store', () => {
    loadVirtualContentViews(data, workspace_1.id);

    const view1 = storeItem(ContentViewsStore, 'virtual-1');
    const view2 = storeItem(ContentViewsStore, 'virtual-2');

    expect(view1).not.toBeNull();
    expect(view2).not.toBeNull();
  });

  it("loads the views into the workspace's store record", () => {
    loadVirtualContentViews(data, workspace_2.id);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(
      ContentViewsStore.in(workspace_2.id).get('virtual-1'),
    ).not.toBeNull();
    expect(ContentViewsStore).not.toHaveItem('virtual-1');
  });

  it('marks loaded views as virtual', () => {
    loadVirtualContentViews(data, workspace_1.id);

    const view = storeItem(ContentViewsStore, 'virtual-1');

    expect(view.virtual).toBe(true);
  });

  it('sets properties from the provided data', () => {
    loadVirtualContentViews(data, workspace_1.id);

    const view = storeItem(ContentViewsStore, 'virtual-1');

    expect(view.name).toBe('View 1');
    expect(view.type).toBe('gallery');
    expect(view.icon).toBe('layout');
    expect(view.dataSource).toEqual({
      type: 'database',
      id: 'database-1',
    });
  });

  it('carries owner and owner key onto the loaded views', () => {
    loadVirtualContentViews(data, workspace_1.id);

    const view = storeItem(ContentViewsStore, 'virtual-1');

    expect(view.owner).toBe('database_owner-1');
    expect(view.ownerKey).toBe('layout_1:Related');
  });

  it('sets created and lastModified dates', () => {
    loadVirtualContentViews(data, workspace_1.id);

    const view = storeItem(ContentViewsStore, 'virtual-1');

    expect(view.created).toEqual(mockDate);
    expect(view.lastModified).toEqual(mockDate);
  });

  it('dispatches a views loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener(ContentViewsLoadedEvent, 'test', (payload) => {
        expect(payload).toHaveLength(2);
        expect(payload[0].virtual).toBe(true);
        done();
      });

      loadVirtualContentViews(data, workspace_1.id);
    }));
});
