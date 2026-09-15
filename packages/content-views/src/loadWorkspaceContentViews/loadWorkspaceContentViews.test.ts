import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { storeItem } from '@minddrop/stores/test-utils';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewsDirName } from '../constants';
import { ContentViewsLoadedEvent } from '../events';
import {
  MockFs,
  cleanup,
  contentViewType_referencing,
  contentView_gallery_1,
  contentViews,
  setup,
} from '../test-utils';
import { resolveContentViewFilePath } from '../utils';
import { loadWorkspaceContentViews } from './loadWorkspaceContentViews';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

// The loaded views including their references index
const loadedViews = contentViews.map((view) => ({ ...view, references: [] }));

// A view file in the second workspace
const otherView = {
  ...contentView_gallery_1,
  id: 'content-view_gallery_other',
};
const otherViewPath = Fs.concatPath(
  workspace_2.path,
  Paths.hiddenDirName,
  ContentViewsDirName,
  `${otherView.id}.json`,
);

describe('loadWorkspaceContentViews', () => {
  beforeEach(() => {
    setup({ loadViews: false });

    // Add a view file to a workspace other than the active one
    MockFs.addFiles([
      { path: otherViewPath, textContent: JSON.stringify(otherView) },
    ]);
  });

  afterEach(cleanup);

  it('loads views into the store', async () => {
    await loadWorkspaceContentViews(workspace_1);

    expect(ContentViewsStore).toHaveItems(loadedViews);
  });

  it('does not load views from other workspaces', async () => {
    await loadWorkspaceContentViews(workspace_1);

    expect(ContentViewsStore).toHaveItems(loadedViews);
  });

  it("loads views into the workspace's store record", async () => {
    await loadWorkspaceContentViews(workspace_2);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(ContentViewsStore.in(workspace_2.id).get(otherView.id)).toEqual({
      ...otherView,
      references: [],
    });
    expect(ContentViewsStore).not.toHaveItem(otherView.id);
  });

  it('dispatches a views loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ContentViewsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(loadedViews);
        done();
      });

      loadWorkspaceContentViews(workspace_1);
    }));

  it('resolves item references in the loaded workspace and indexes them', async () => {
    // Register an adapter claiming 'address:' references, prefixing
    // resolved IDs with the workspace they were resolved in.
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference, workspaceId) => {
        if (!reference.startsWith('address:')) {
          return null;
        }

        return {
          type: 'database-entry',
          id: `${workspaceId}:${reference.slice('address:'.length)}`,
        };
      },
    });

    // A view file holding a durable reference in its data
    const referencingView = {
      ...contentView_gallery_1,
      id: 'content-view_referencing-1',
      type: contentViewType_referencing.type,
      data: { items: ['address:database-entry_one'] },
    };

    MockFs.addFiles([
      {
        path: resolveContentViewFilePath(referencingView.id),
        textContent: JSON.stringify(referencingView),
      },
    ]);

    await loadWorkspaceContentViews(workspace_1);

    const loaded = storeItem(ContentViewsStore, referencingView.id);

    // The loaded data holds resolved item IDs, indexed as references
    const resolvedId = `${workspace_1.id}:database-entry_one`;
    expect(loaded.data).toEqual({ items: [resolvedId] });
    expect(loaded.references).toEqual([resolvedId]);

    ItemReferences.unregisterAdapter('database-entry');
  });
});
