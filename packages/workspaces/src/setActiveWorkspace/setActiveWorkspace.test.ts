import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { WorkspaceNotFoundError } from '../errors';
import { ActiveWorkspaceChangedEvent } from '../events';
import {
  MockFs,
  cleanup,
  setup,
  workspace_1,
  workspace_2,
} from '../test-utils';
import { WorkspacesConfig } from '../types';
import { resolveWorkspacesConfigFilePath } from '../utils';
import { setActiveWorkspace } from './setActiveWorkspace';

// The workspaces made active by the dispatched events
let activated: string[] = [];

describe('setActiveWorkspace', () => {
  beforeEach(() => {
    setup();
    activated = [];

    // Collect the workspaces of dispatched active changed events
    Events.addListener(ActiveWorkspaceChangedEvent, 'test', (workspace) => {
      activated.push(workspace.id);
    });
  });

  afterEach(cleanup);

  it('throws if the workspace does not exist', async () => {
    await expect(() => setActiveWorkspace('missing')).rejects.toThrow(
      WorkspaceNotFoundError,
    );
  });

  it('sets the workspace as active', async () => {
    await setActiveWorkspace(workspace_2.id);

    expect(ActiveWorkspaceStore).toHaveStoredValue('id', workspace_2.id);
  });

  it('writes the active path to the workspaces config', async () => {
    await setActiveWorkspace(workspace_2.id);

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      resolveWorkspacesConfigFilePath(),
    );

    expect(config.activePath).toBe(workspace_2.path);
  });

  it('dispatches an active workspace changed event', async () => {
    await setActiveWorkspace(workspace_2.id);

    expect(activated).toEqual([workspace_2.id]);
  });

  it('does nothing if the workspace is already active', async () => {
    await setActiveWorkspace(workspace_1.id);

    expect(activated).toEqual([]);
  });
});
