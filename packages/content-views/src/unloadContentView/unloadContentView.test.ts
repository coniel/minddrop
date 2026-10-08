import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewDeletedEvent } from '../events';
import { ContentViewFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveContentViewFilePath } from '../utils';
import { unloadContentView } from './unloadContentView';

const { workspace_1, workspace_2 } = WorkspaceFixtures;
const { contentView_gallery_1 } = ContentViewFixtures;

describe('unloadContentView', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('removes the content view from the store', () => {
    unloadContentView(contentView_gallery_1.id);

    expect(ContentViewsStore).not.toHaveItem(contentView_gallery_1.id);
  });

  it("leaves the content view's file in place", () => {
    unloadContentView(contentView_gallery_1.id);

    expect(
      MockFs.exists(
        resolveContentViewFilePath(contentView_gallery_1.id, workspace_1.path),
      ),
    ).toBe(true);
  });

  it('does not dispatch a content view deleted event', async () => {
    // Record any content view deleted event
    let dispatched = false;

    Events.on(ContentViewDeletedEvent, 'test', () => {
      dispatched = true;
    });

    unloadContentView(contentView_gallery_1.id);

    // Let any dispatched event reach its listeners
    await Events.tests.awaitAllListeners();

    expect(dispatched).toBe(false);
  });

  it("removes the content view from the given workspace's record only", () => {
    // Add the view to the second workspace's record
    ContentViewsStore.in(workspace_2.id).set(contentView_gallery_1);

    unloadContentView(contentView_gallery_1.id, workspace_2.id);

    expect(
      ContentViewsStore.in(workspace_2.id).get(contentView_gallery_1.id),
    ).toBeNull();
    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id);
  });
});
