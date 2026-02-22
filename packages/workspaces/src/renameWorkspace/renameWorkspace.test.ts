import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { omitPath } from '@minddrop/utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceUpdatedEvent, WorkspaceUpdatedEventData } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  workspace_1,
  workspace_2,
} from '../test-utils';
import { Workspace, WorkspacesConfig } from '../types';
import {
  getWorkspaceConfigFilePath,
  getWorkspacesConfigFilePath,
} from '../utils';
import { renameWorkspace } from './renameWorkspace';

const newName = 'New Name';
const newPath = Fs.concatPath(Fs.parentDirPath(workspace_1.path), newName);
const updatedWorkspace: Workspace = {
  ...workspace_1,
  path: newPath,
  name: newName,
  lastModified: mockDate,
};

describe('renameWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does nothing if the new name is the same', async () => {
    const result = await renameWorkspace(workspace_1.id, workspace_1.name);

    expect(result).toEqual(workspace_1);
  });

  it('throws if the new path is already taken', async () => {
    await expect(() =>
      renameWorkspace(workspace_1.id, workspace_2.name),
    ).rejects.toThrow(PathConflictError);
  });

  it('renames the workspace directory', async () => {
    await renameWorkspace(workspace_1.id, newName);

    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(workspace_1.path)).toBe(false);
  });

  it('updates the workspace in the store', async () => {
    await renameWorkspace(workspace_1.id, newName);

    expect(WorkspacesStore.get(workspace_1.id)).toEqual(updatedWorkspace);
  });

  it('writes the updated workspace to the file system', async () => {
    await renameWorkspace(workspace_1.id, newName);

    expect(MockFs.readJsonFile(getWorkspaceConfigFilePath(newPath))).toEqual(
      omitPath(updatedWorkspace),
    );
  });

  it('writes the workspaces config', async () => {
    await renameWorkspace(workspace_1.id, newName);

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      getWorkspacesConfigFilePath(),
    );

    expect(config.paths.includes(newPath)).toBe(true);
    expect(config.paths.includes(workspace_1.path)).toBe(false);
  });

  it('returns the updated workspace', async () => {
    const result = await renameWorkspace(workspace_1.id, newName);

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

      renameWorkspace(workspace_1.id, newName);
    }));
});
