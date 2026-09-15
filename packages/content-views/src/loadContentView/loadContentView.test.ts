import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  MockFs,
  cleanup,
  contentViewType_referencing,
  contentView_gallery_1,
  setup,
} from '../test-utils';
import { resolveContentViewFilePath } from '../utils';
import { loadContentView } from './loadContentView';

const { workspace_2 } = WorkspaceFixtures;

describe('loadContentView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads a view from the file system with its references index', async () => {
    const view = await loadContentView(
      resolveContentViewFilePath(contentView_gallery_1.id),
    );

    expect(view).toEqual({ ...contentView_gallery_1, references: [] });
  });

  it('returns null if the view does not exist', async () => {
    const view = await loadContentView('missing-view');

    expect(view).toBeNull();
  });

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

    const view = await loadContentView(
      resolveContentViewFilePath(referencingView.id),
    );

    // The loaded data holds resolved item IDs, indexed as references
    expect(view?.data).toEqual({ items: ['database-entry_one'] });
    expect(view?.references).toEqual(['database-entry_one']);

    ItemReferences.unregisterAdapter('database-entry');
  });

  it('resolves item references in the given workspace', async () => {
    // Register an adapter naming the workspace resolved in
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference, workspaceId) => ({
        type: 'database-entry',
        id: `${workspaceId}:${reference}`,
      }),
    });

    // A view file holding a durable reference in its data
    const referencingView = {
      ...contentView_gallery_1,
      id: 'content-view_referencing-1',
      type: contentViewType_referencing.type,
      data: { items: ['Books/One'] },
    };

    MockFs.addFiles([
      {
        path: resolveContentViewFilePath(referencingView.id),
        textContent: JSON.stringify(referencingView),
      },
    ]);

    const view = await loadContentView(
      resolveContentViewFilePath(referencingView.id),
      workspace_2.id,
    );

    expect(view?.data).toEqual({ items: [`${workspace_2.id}:Books/One`] });

    ItemReferences.unregisterAdapter('database-entry');
  });
});
