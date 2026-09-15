import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import { cleanup, contentView_gallery_1, setup } from '../test-utils';
import { resolveContentViewFilePath } from '../utils';
import { initializeContentViews } from './initializeContentViews';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeContentViews', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('applies content view file changes made outside of the app', async () => {
    initializeContentViews();

    Events.dispatch(Fs.events.Changed, {
      workspaceId: workspace_1.id,
      path: resolveContentViewFilePath(contentView_gallery_1.id),
      kind: 'deleted',
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(ContentViewsStore).not.toHaveItem(contentView_gallery_1.id);
  });
});
