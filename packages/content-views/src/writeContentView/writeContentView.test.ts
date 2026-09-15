import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { InvalidParameterError } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import {
  MockFs,
  cleanup,
  contentViewType_referencing,
  contentView_gallery_1,
  contentView_virtual_1,
  setup,
} from '../test-utils';
import { ContentView } from '../types';
import { resolveContentViewFilePath } from '../utils';
import { resolveContentViewsDirPath } from '../utils/resolveContentViewsDirPath';
import { writeContentView } from './writeContentView';

// A view referencing an entry via the referencing view type's data
const referencingView: ContentView = {
  ...contentView_gallery_1,
  id: 'content-view_referencing-1',
  type: contentViewType_referencing.type,
  data: { items: ['database-entry_one'] },
  references: ['database-entry_one'],
};

const { workspace_2 } = WorkspaceFixtures;

describe('writeContentView', () => {
  beforeEach(() => setup({ loadViewFiles: false }));

  afterEach(cleanup);

  it('writes the view to the file system', async () => {
    await writeContentView(contentView_gallery_1.id);

    expect(
      MockFs.readJsonFile(resolveContentViewFilePath(contentView_gallery_1.id)),
    ).toEqual(contentView_gallery_1);
  });

  it('creates the Views directory if it does not exist', async () => {
    // Remove the content views directory
    MockFs.removeDir(resolveContentViewsDirPath(), { recursive: true });

    await writeContentView(contentView_gallery_1.id);

    expect(MockFs.exists(resolveContentViewsDirPath())).toBe(true);
  });

  it('serializes item references and strips the references index', async () => {
    // Register an adapter converting entry IDs to addresses
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => `address:${id}`,
      match: () => null,
    });

    ContentViewsStore.set(referencingView);

    await writeContentView(referencingView.id);

    const written = MockFs.readJsonFile<ContentView>(
      resolveContentViewFilePath(referencingView.id),
    );

    // The written data holds durable references
    expect(written.data).toEqual({ items: ['address:database-entry_one'] });

    // The references index is not persisted
    expect('references' in written).toBe(false);

    ItemReferences.unregisterAdapter('database-entry');
  });

  it('throws when writing a virtual view', async () => {
    // Add a virtual content view to the store
    ContentViewsStore.set(contentView_virtual_1);

    await expect(writeContentView(contentView_virtual_1.id)).rejects.toThrow(
      InvalidParameterError,
    );
  });

  it("writes the view into the given workspace's content views directory", async () => {
    // A view held by the second workspace only
    ContentViewsStore.in(workspace_2.id).set(contentView_gallery_1);

    await writeContentView(contentView_gallery_1.id, workspace_2.id);

    expect(
      MockFs.readJsonFile(
        resolveContentViewFilePath(contentView_gallery_1.id, workspace_2.path),
      ),
    ).toEqual(contentView_gallery_1);
  });
});
