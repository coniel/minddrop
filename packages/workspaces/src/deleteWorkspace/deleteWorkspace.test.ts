import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceDeletedEvent } from '../events';
import { MockFs, cleanup, setup, workspace_1 } from '../test-utils';
import { WorkspacesConfig } from '../types';
import { getWorkspacesConfigFilePath } from '../utils';
import { deleteWorkspace } from './deleteWorkspace';

describe('deleteWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the workspace directory', async () => {
    await deleteWorkspace(workspace_1.id);

    expect(MockFs.exists(workspace_1.path)).toBe(false);
  });

  it('removes the workspace from the store', async () => {
    await deleteWorkspace(workspace_1.id);

    expect(WorkspacesStore.get(workspace_1.id)).toBeNull();
  });

  it('writes the workspaces config', async () => {
    await deleteWorkspace(workspace_1.id);

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      getWorkspacesConfigFilePath(),
    );

    expect(config.paths.includes(workspace_1.path)).toBe(false);
  });

  it('dispatches a workspaces deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(WorkspaceDeletedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(workspace_1);
        done();
      });

      deleteWorkspace(workspace_1.id);
    }));
});
