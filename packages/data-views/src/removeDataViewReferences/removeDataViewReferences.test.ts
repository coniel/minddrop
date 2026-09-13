import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DataViewsStore } from '../DataViewsStore';
import {
  MockFs,
  cleanup,
  dataViewType_referencing,
  dataView_gallery_1,
  setup,
} from '../test-utils';
import { DataView } from '../types';
import { resolveViewFilePath } from '../utils';
import { removeDataViewReferences } from './removeDataViewReferences';

// A persisted view referencing two entries
const referencingView: DataView = {
  ...dataView_gallery_1,
  id: 'data-view_referencing-1',
  type: dataViewType_referencing.type,
  data: { items: ['database-entry_one', 'database-entry_two'] },
  references: ['database-entry_one', 'database-entry_two'],
};

const { workspace_2 } = WorkspaceFixtures;

describe('removeDataViewReferences', () => {
  beforeEach(() => {
    setup({ loadViewFiles: false });

    DataViewsStore.set(referencingView);
  });

  afterEach(cleanup);

  it('removes the items from referencing views', async () => {
    await removeDataViewReferences(['database-entry_one']);

    const view = storeItem(DataViewsStore, referencingView.id);

    // The view's config and references index drop the removed item
    expect(view.data).toEqual({ items: ['database-entry_two'] });
    expect(view.references).toEqual(['database-entry_two']);

    // The cleaned config is persisted
    const written = MockFs.readJsonFile<DataView>(
      resolveViewFilePath(referencingView.id),
    );
    expect(written.data).toEqual({ items: ['database-entry_two'] });
  });

  it('does not update views without matching references', async () => {
    await removeDataViewReferences(['database-entry_other']);

    // The unaffected view is not written to disk
    expect(MockFs.exists(resolveViewFilePath(referencingView.id))).toBe(false);
  });

  it('removes the items from the views of the given workspace', async () => {
    // The referencing view held by the second workspace as well
    DataViewsStore.in(workspace_2.id).set(referencingView);

    await removeDataViewReferences(['database-entry_one'], workspace_2.id);

    // Should rewrite the second workspace's view, leaving the active
    // workspace's as it was.
    expect(
      DataViewsStore.in(workspace_2.id).get(referencingView.id)?.data,
    ).toEqual({ items: ['database-entry_two'] });
    expect(storeItem(DataViewsStore, referencingView.id).data).toEqual({
      items: ['database-entry_one', 'database-entry_two'],
    });
  });
});
