import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewUpdatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  contentView_gallery_1,
  contentView_virtual_1,
  mockDate,
  setup,
} from '../test-utils';
import { ContentView } from '../types';
import { resolveContentViewFilePath } from '../utils';
import { updateContentView } from './updateContentView';

const update = {
  options: { layout: 'grid' },
};
const updatedView: ContentView = {
  ...contentView_gallery_1,
  options: update.options,
  lastModified: mockDate,
  references: [],
};

// The updated view as written to disk, without the references index
const { references: _references, ...writtenView } = updatedView;

const { workspace_2 } = WorkspaceFixtures;

describe('updateContentView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view in the store', async () => {
    await updateContentView(contentView_gallery_1.id, update);

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id, updatedView);
  });

  it('updates the view in the given workspace', async () => {
    // A view held by the second workspace only
    ContentViewsStore.in(workspace_2.id).set(contentView_gallery_1);

    await updateContentView(
      contentView_gallery_1.id,
      update,
      true,
      workspace_2.id,
    );

    // Should update the second workspace's record and write into its
    // content views directory, leaving the active workspace's view as it was.
    expect(
      ContentViewsStore.in(workspace_2.id).get(contentView_gallery_1.id),
    ).toEqual(updatedView);
    expect(
      MockFs.readJsonFile(
        resolveContentViewFilePath(contentView_gallery_1.id, workspace_2.path),
      ),
    ).toEqual(writtenView);
    expect(ContentViewsStore).toHaveItem(
      contentView_gallery_1.id,
      contentView_gallery_1,
    );
  });

  it('writes the view to the file system', async () => {
    await updateContentView(contentView_gallery_1.id, update);

    expect(
      MockFs.readJsonFile(resolveContentViewFilePath(contentView_gallery_1.id)),
    ).toEqual(writtenView);
  });

  it('returns the updated view', async () => {
    const result = await updateContentView(contentView_gallery_1.id, update);

    expect(result).toEqual(updatedView);
  });

  it('shallow merges update data if deepMerge is false', async () => {
    const result = await updateContentView(
      contentView_gallery_1.id,
      update,
      false,
    );

    expect(result).toEqual({
      ...updatedView,
      options: update.options,
    });
  });

  it('does not write to the file system for virtual views', async () => {
    // Add a virtual content view to the store
    ContentViewsStore.set(contentView_virtual_1);

    await updateContentView(contentView_virtual_1.id, { name: 'Updated' });

    // Should not have created a file
    expect(
      MockFs.exists(resolveContentViewFilePath(contentView_virtual_1.id)),
    ).toBe(false);
  });

  it('allows changing the ID of a virtual view', async () => {
    // Add a virtual content view to the store
    ContentViewsStore.set(contentView_virtual_1);

    const result = await updateContentView(contentView_virtual_1.id, {
      id: 'new-virtual-id',
    });

    // Old ID should be removed
    expect(ContentViewsStore).not.toHaveItem(contentView_virtual_1.id);

    // New ID should exist
    expect(ContentViewsStore).toHaveItem('new-virtual-id');
    expect(result.id).toBe('new-virtual-id');
  });

  it('throws when attempting to change the ID of a non-virtual view', async () => {
    await expect(
      updateContentView(contentView_gallery_1.id, { id: 'new-id' }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('dispatches a view updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ContentViewUpdatedEvent, 'test', (payload) => {
        expect(payload.original).toEqual(contentView_gallery_1);
        expect(payload.updated).toEqual(updatedView);
        done();
      });

      updateContentView(contentView_gallery_1.id, update);
    }));
});
