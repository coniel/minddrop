import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  contentView_gallery_1,
  contentView_virtual_1,
  setup,
} from '../test-utils';
import { resolveContentViewFilePath } from '../utils';
import { deleteContentView } from './deleteContentView';

const { workspace_2 } = WorkspaceFixtures;

describe('deleteContentView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the view from the store', async () => {
    await deleteContentView(contentView_gallery_1.id);

    expect(ContentViewsStore).not.toHaveItem(contentView_gallery_1.id);
  });

  it('deletes the view file', async () => {
    await deleteContentView(contentView_gallery_1.id);

    expect(
      MockFs.exists(resolveContentViewFilePath(contentView_gallery_1.id)),
    ).toBe(false);
  });

  it('deletes the view from the given workspace', async () => {
    const otherPath = resolveContentViewFilePath(
      contentView_gallery_1.id,
      workspace_2.path,
    );

    // A view held by the second workspace only
    ContentViewsStore.in(workspace_2.id).set(contentView_gallery_1);
    MockFs.addFiles([
      { path: otherPath, textContent: JSON.stringify(contentView_gallery_1) },
    ]);

    await deleteContentView(contentView_gallery_1.id, workspace_2.id);

    // Should remove the second workspace's view and file, leaving the
    // active workspace's as they were.
    expect(
      ContentViewsStore.in(workspace_2.id).get(contentView_gallery_1.id),
    ).toBeNull();
    expect(MockFs.exists(otherPath)).toBe(false);
    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id);
    expect(
      MockFs.exists(resolveContentViewFilePath(contentView_gallery_1.id)),
    ).toBe(true);
  });

  it('does not delete a file for virtual views', async () => {
    // Add a virtual content view to the store
    ContentViewsStore.set(contentView_virtual_1);

    await deleteContentView(contentView_virtual_1.id);

    // Should not throw or attempt file deletion
    expect(ContentViewsStore).not.toHaveItem(contentView_virtual_1.id);
  });

  it('dispatches a view deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ContentViewDeletedEvent, 'test', (payload) => {
        expect(payload).toEqual(contentView_gallery_1);
        done();
      });

      deleteContentView(contentView_gallery_1.id);
    }));
});
