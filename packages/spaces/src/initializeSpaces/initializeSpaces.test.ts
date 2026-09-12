import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { SpacesStore } from '../SpacesStore';
import { cleanup, setup, space_1 } from '../test-utils';
import { resolveSpaceFilePath } from '../utils';
import { initializeSpaces } from './initializeSpaces';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeSpaces', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('applies space bundle changes made outside of the app', async () => {
    initializeSpaces();

    Events.dispatch(Fs.events.Changed, {
      workspaceId: workspace_1.id,
      path: resolveSpaceFilePath(space_1.id),
      kind: 'deleted',
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(SpacesStore).not.toHaveItem(space_1.id);
  });
});
