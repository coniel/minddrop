import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import {
  cleanup,
  contentView_board_1,
  contentView_gallery_1,
  setup,
} from '../test-utils';
import { getOwnedContentViews } from './getOwnedContentViews';

const { workspace_2 } = WorkspaceFixtures;

describe('getOwnedContentViews', () => {
  beforeEach(() => {
    setup({});

    // Assign owners to a couple of fixture views
    ContentViewsStore.update(contentView_board_1.id, {
      owner: 'owner_1',
    });
    ContentViewsStore.update(contentView_gallery_1.id, {
      owner: 'owner_2',
    });
  });

  afterEach(cleanup);

  it('retrieves views owned by the given owner', () => {
    const views = getOwnedContentViews('owner_1');

    expect(views.map((view) => view.id)).toEqual([contentView_board_1.id]);
  });

  it('does not retrieve views owned by other owners', () => {
    expect(getOwnedContentViews('owner_other')).toEqual([]);
  });

  it("retrieves views from the given workspace's record", () => {
    // Add an owned view to the second workspace's record only
    ContentViewsStore.in(workspace_2.id).set({
      ...contentView_gallery_1,
      id: 'content-view_gallery_9',
      owner: 'owner_3',
    });

    const views = getOwnedContentViews('owner_3', workspace_2.id);

    expect(views.map((view) => view.id)).toEqual(['content-view_gallery_9']);
  });
});
