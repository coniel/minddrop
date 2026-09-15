import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import {
  MockFs,
  cleanup,
  contentViewType_referencing,
  contentView_gallery_1,
  setup,
} from '../test-utils';
import { ContentView } from '../types';
import { resolveContentViewFilePath } from '../utils';
import { removeContentViewReferences } from './removeContentViewReferences';

// A persisted view referencing two entries
const referencingView: ContentView = {
  ...contentView_gallery_1,
  id: 'content-view_referencing-1',
  type: contentViewType_referencing.type,
  data: { items: ['database-entry_one', 'database-entry_two'] },
  references: ['database-entry_one', 'database-entry_two'],
};

const { workspace_2 } = WorkspaceFixtures;

describe('removeContentViewReferences', () => {
  beforeEach(() => {
    setup({ loadViewFiles: false });

    ContentViewsStore.set(referencingView);
  });

  afterEach(cleanup);

  it('removes the items from referencing views', async () => {
    await removeContentViewReferences(['database-entry_one']);

    const view = storeItem(ContentViewsStore, referencingView.id);

    // The view's config and references index drop the removed item
    expect(view.data).toEqual({ items: ['database-entry_two'] });
    expect(view.references).toEqual(['database-entry_two']);

    // The cleaned config is persisted
    const written = MockFs.readJsonFile<ContentView>(
      resolveContentViewFilePath(referencingView.id),
    );
    expect(written.data).toEqual({ items: ['database-entry_two'] });
  });

  it('does not update views without matching references', async () => {
    await removeContentViewReferences(['database-entry_other']);

    // The unaffected view is not written to disk
    expect(MockFs.exists(resolveContentViewFilePath(referencingView.id))).toBe(
      false,
    );
  });

  it('removes the items from the views of the given workspace', async () => {
    // The referencing view held by the second workspace as well
    ContentViewsStore.in(workspace_2.id).set(referencingView);

    await removeContentViewReferences(['database-entry_one'], workspace_2.id);

    // Should rewrite the second workspace's view, leaving the active
    // workspace's as it was.
    expect(
      ContentViewsStore.in(workspace_2.id).get(referencingView.id)?.data,
    ).toEqual({ items: ['database-entry_two'] });
    expect(storeItem(ContentViewsStore, referencingView.id).data).toEqual({
      items: ['database-entry_one', 'database-entry_two'],
    });
  });
});
