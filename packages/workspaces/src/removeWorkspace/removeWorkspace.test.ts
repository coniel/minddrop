import { Events } from '@minddrop/events';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { getWorkspace } from '../getWorkspace';
import { setup, cleanup, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { removeWorkspace } from './removeWorkspace';

describe('removeWorkspace', () => {
  beforeEach(() => {
    setup();

    // Add a workspace to the store
    WorkspacesStore.getState().add(workspace1);
  });

  afterEach(cleanup);

  it('removes the workspace from the store', () => {
    // Remove a workspace
    removeWorkspace(workspace1.path);

    // Workspace should no longer be in the store
    expect(getWorkspace(workspace1.path)).toBeNull();
  });

  it('dispatches a `workspaces:workspace:remove` event', () =>
    new Promise<void>((done) => {
      // Listen to 'workspaces:workspace:remove' events
      Events.addListener('workspaces:workspace:remove', 'test', (payload) => {
        // Payload data should be the workspace
        expect(payload.data).toEqual(workspace1);
        done();
      });

      // Remove a workspace
      removeWorkspace(workspace1.path);
    }));

  it('does nothing if workspace does not exist', () => {
    vi.spyOn(WorkspacesStore.getState(), 'remove');

    // Remove a workspace that does not exist
    removeWorkspace('missing');

    expect(WorkspacesStore.getState().remove).not.toHaveBeenCalled();
  });
});
