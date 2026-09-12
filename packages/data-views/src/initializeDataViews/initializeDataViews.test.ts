import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DataViewsStore } from '../DataViewsStore';
import { cleanup, dataView_gallery_1, setup } from '../test-utils';
import { resolveViewFilePath } from '../utils';
import { initializeDataViews } from './initializeDataViews';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeDataViews', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('applies data view file changes made outside of the app', async () => {
    initializeDataViews();

    Events.dispatch(Fs.events.Changed, {
      workspaceId: workspace_1.id,
      path: resolveViewFilePath(dataView_gallery_1.id),
      kind: 'deleted',
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(DataViewsStore).not.toHaveItem(dataView_gallery_1.id);
  });
});
