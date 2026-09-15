import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../../ContentViewsStore';
import {
  MockFs,
  cleanup,
  contentViewType_referencing,
  contentView_gallery_1,
  setup,
} from '../../test-utils';
import { ContentView } from '../../types';
import { resolveContentViewFilePath } from '../../utils';
import { onItemAddressesChanged } from './item-addresses-changed';

// A persisted view referencing the changed entry
const referencingView: ContentView = {
  ...contentView_gallery_1,
  id: 'content-view_referencing-1',
  type: contentViewType_referencing.type,
  data: { items: ['database-entry_one'] },
  references: ['database-entry_one'],
};

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('onItemAddressesChanged', () => {
  beforeEach(() => {
    setup({ loadViewFiles: false });

    // Register an adapter serializing IDs to observable addresses
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => `address:${id}`,
      match: () => null,
    });

    ContentViewsStore.set(referencingView);
  });

  afterEach(async () => {
    await cleanup();
    ItemReferences.unregisterAdapter('database-entry');
  });

  it('rewrites persisted views referencing changed items', async () => {
    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: 'database-entry_one',
          oldReference: 'old:database-entry_one',
          newReference: 'address:database-entry_one',
        },
      ],
    });

    const written = MockFs.readJsonFile<ContentView>(
      resolveContentViewFilePath(referencingView.id),
    );

    // The rewritten file holds freshly serialized references
    expect(written.data).toEqual({ items: ['address:database-entry_one'] });
  });

  it("rewrites the views of the changes' workspace", async () => {
    // The view held by the second workspace as well
    ContentViewsStore.in(workspace_2.id).set(referencingView);

    await onItemAddressesChanged({
      workspaceId: workspace_2.id,
      changes: [
        {
          id: 'database-entry_one',
          oldReference: 'old:database-entry_one',
          newReference: 'address:database-entry_one',
        },
      ],
    });

    // The file is rewritten under the second workspace only
    expect(
      MockFs.readJsonFile<ContentView>(
        resolveContentViewFilePath(referencingView.id, workspace_2.path),
      ).data,
    ).toEqual({ items: ['address:database-entry_one'] });
    expect(MockFs.exists(resolveContentViewFilePath(referencingView.id))).toBe(
      false,
    );
  });

  it('does not rewrite views without changed references', async () => {
    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: 'database-entry_other',
          oldReference: 'old:database-entry_other',
          newReference: 'address:database-entry_other',
        },
      ],
    });

    // No file is written for the unaffected view
    expect(MockFs.exists(resolveContentViewFilePath(referencingView.id))).toBe(
      false,
    );
  });
});
