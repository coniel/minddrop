import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  MockFs,
  cleanup,
  dataViewType_referencing,
  dataView_gallery_1,
  setup,
} from '../test-utils';
import { resolveViewFilePath } from '../utils';
import { loadDataView } from './loadDataView';

const { workspace_2 } = WorkspaceFixtures;

describe('loadDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads a view from the file system with its references index', async () => {
    const view = await loadDataView(resolveViewFilePath(dataView_gallery_1.id));

    expect(view).toEqual({ ...dataView_gallery_1, references: [] });
  });

  it('returns null if the view does not exist', async () => {
    const view = await loadDataView('missing-view');

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

    const view = await loadDataView(resolveViewFilePath(referencingView.id));

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
      ...dataView_gallery_1,
      id: 'data-view_referencing-1',
      type: dataViewType_referencing.type,
      data: { items: ['Books/One'] },
    };

    MockFs.addFiles([
      {
        path: resolveViewFilePath(referencingView.id),
        textContent: JSON.stringify(referencingView),
      },
    ]);

    const view = await loadDataView(
      resolveViewFilePath(referencingView.id),
      workspace_2.id,
    );

    expect(view?.data).toEqual({ items: [`${workspace_2.id}:Books/One`] });

    ItemReferences.unregisterAdapter('database-entry');
  });
});
