import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { storeItem } from '@minddrop/stores/test-utils';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DataViewsStore } from '../DataViewsStore';
import { ViewsDirName } from '../constants';
import { DataViewsLoadedEvent } from '../events';
import {
  MockFs,
  cleanup,
  dataViewType_referencing,
  dataView_gallery_1,
  dataViews,
  setup,
} from '../test-utils';
import { resolveViewFilePath } from '../utils';
import { initializeDataViews } from './initializeDataViews';

const { workspace_2 } = WorkspaceFixtures;

// The loaded views including their references index
const loadedViews = dataViews.map((view) => ({ ...view, references: [] }));

describe('initializeDataViews', () => {
  beforeEach(() => setup({ loadViews: false }));

  afterEach(cleanup);

  it('loads views into the store', async () => {
    await initializeDataViews();

    expect(DataViewsStore).toHaveItems(loadedViews);
  });

  it('does not load views from other workspaces', async () => {
    // Add a view file to a workspace other than the active one
    MockFs.addFiles([
      {
        path: Fs.concatPath(
          workspace_2.path,
          Paths.hiddenDirName,
          ViewsDirName,
          'data-view_gallery_other.json',
        ),
        textContent: JSON.stringify({
          ...dataView_gallery_1,
          id: 'data-view_gallery_other',
        }),
      },
    ]);

    await initializeDataViews();

    expect(DataViewsStore).toHaveItems(loadedViews);
  });

  it('dispatches a views loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(loadedViews);
        done();
      });

      initializeDataViews();
    }));

  it('resolves item references and indexes them', async () => {
    // Register an adapter claiming 'address:' references
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference) =>
        reference.startsWith('address:')
          ? { type: 'database-entry', id: reference.slice('address:'.length) }
          : null,
    });

    // A view file holding a durable reference in its data
    const referencingView = {
      ...dataView_gallery_1,
      id: 'data-view_referencing-1',
      type: dataViewType_referencing.type,
      data: { items: ['address:database-entry_one'] },
    };

    MockFs.addFiles([
      {
        path: resolveViewFilePath(referencingView.id),
        textContent: JSON.stringify(referencingView),
      },
    ]);

    await initializeDataViews();

    const loaded = storeItem(DataViewsStore, referencingView.id);

    // The loaded data holds resolved item IDs, indexed as references
    expect(loaded.data).toEqual({ items: ['database-entry_one'] });
    expect(loaded.references).toEqual(['database-entry_one']);

    ItemReferences.unregisterAdapter('database-entry');
  });
});
