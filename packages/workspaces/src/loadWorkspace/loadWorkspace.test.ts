import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { LoadedWorkspacesStore } from '../LoadedWorkspacesStore';
import { WorkspaceLoadersRegistry } from '../WorkspaceLoadersRegistry';
import { WorkspaceNotFoundError } from '../errors';
import { WorkspaceLoadedEvent } from '../events';
import { cleanup, setup, workspace_1, workspace_2 } from '../test-utils';
import { Workspace } from '../types';
import { loadWorkspace } from './loadWorkspace';

// The loader runs recorded as '<loader ID>:<workspace ID>', in the
// order they completed.
let runs: string[] = [];

// Registers a loader recording its runs
function registerLoader(id: string): void {
  WorkspaceLoadersRegistry.register({
    id,
    load: async (workspace: Workspace) => {
      runs.push(`${id}:${workspace.id}`);
    },
  });
}

describe('loadWorkspace', () => {
  beforeEach(() => {
    setup();
    runs = [];

    registerLoader('first');
    registerLoader('second');
  });

  afterEach(cleanup);

  it('throws if the workspace does not exist', async () => {
    await expect(() => loadWorkspace('missing')).rejects.toThrow(
      WorkspaceNotFoundError,
    );
  });

  it('runs the loaders with the workspace in registration order', async () => {
    await loadWorkspace(workspace_2.id);

    expect(runs).toEqual([
      `first:${workspace_2.id}`,
      `second:${workspace_2.id}`,
    ]);
  });

  it('marks the workspace as loaded', async () => {
    await loadWorkspace(workspace_1.id);
    await loadWorkspace(workspace_2.id);

    expect(LoadedWorkspacesStore.get('ids')).toEqual([
      workspace_1.id,
      workspace_2.id,
    ]);
  });

  it('dispatches a workspace loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(WorkspaceLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(workspace_2);
        done();
      });

      loadWorkspace(workspace_2.id);
    }));

  it('does nothing if the workspace is already loaded', async () => {
    await loadWorkspace(workspace_2.id);
    runs = [];

    await loadWorkspace(workspace_2.id);

    expect(runs).toEqual([]);
  });

  it('shares a load in progress between concurrent calls', async () => {
    await Promise.all([
      loadWorkspace(workspace_2.id),
      loadWorkspace(workspace_2.id),
    ]);

    expect(runs).toEqual([
      `first:${workspace_2.id}`,
      `second:${workspace_2.id}`,
    ]);
    expect(LoadedWorkspacesStore.get('ids')).toEqual([workspace_2.id]);
  });
});
