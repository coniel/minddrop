import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError, omitPath } from '@minddrop/utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceUpdatedEvent, WorkspaceUpdatedEventData } from '../events';
import { MockFs, cleanup, mockDate, setup, workspace_1 } from '../test-utils';
import { Workspace } from '../types';
import { getWorkspaceConfigFilePath } from '../utils';
import { UpdateWorkspaceData, updateWorkspace } from './updateWorkspace';

const update: UpdateWorkspaceData = { icon: 'new-icon' };
const updatedWorkspace: Workspace = {
  ...workspace_1,
  ...update,
  lastModified: mockDate,
};

describe('updateWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('prevents updating the workspace name', async () => {
    await expect(() =>
      // @ts-expect-error - Testing invalid parameter
      updateWorkspace('workspace-1', { name: 'New name' }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('updates the workspace in the store', async () => {
    await updateWorkspace('workspace-1', update);

    const workspace = WorkspacesStore.get(workspace_1.id);

    expect(workspace).toEqual(updatedWorkspace);
  });

  it('writes the updated workspace config to the file system', async () => {
    await updateWorkspace(workspace_1.id, update);

    const config = MockFs.readJsonFile(
      getWorkspaceConfigFilePath(workspace_1.path),
    );

    expect(config).toEqual(omitPath(updatedWorkspace));
  });

  it('returns the updated workspace', async () => {
    const result = await updateWorkspace(workspace_1.id, update);

    expect(result).toEqual(updatedWorkspace);
  });

  it('dispatches a workspace updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<WorkspaceUpdatedEventData>(
        WorkspaceUpdatedEvent,
        'test',
        (payload) => {
          expect(payload.data.original).toEqual(workspace_1);
          expect(payload.data.updated).toEqual(updatedWorkspace);
          done();
        },
      );

      updateWorkspace(workspace_1.id, update);
    }));
});
