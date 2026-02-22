import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { InvalidParameterError, omitPath } from '@minddrop/utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesLoadedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  workspace_1,
  workspacesRootPath,
} from '../test-utils';
import { Workspace, WorkspacesConfig } from '../types';
import {
  generateWorkspaceConfig,
  getWorkspaceConfigFilePath,
  getWorkspacesConfigFilePath,
} from '../utils';
import { addWorkspace } from './addWorkspace';

const newWorkspacePath = Fs.concatPath(workspacesRootPath, 'New Workspace');
const newWorkspace = {
  ...generateWorkspaceConfig({
    path: newWorkspacePath,
    name: 'New Workspace',
    icon: 'content-icon:box:default',
  }),
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
};

describe('addWorkspace', () => {
  beforeEach(() =>
    setup({ loadWorkspaces: false, loadWorkspacesConfig: false }),
  );

  afterEach(cleanup);

  it('throws if the workspace does not exist', async () => {
    await expect(() => addWorkspace('missing-workspace')).rejects.toThrow(
      FileNotFoundError,
    );
  });

  it('throws if the workspace is not a directory', async () => {
    const path = Fs.concatPath(workspacesRootPath, 'file.txt');

    MockFs.addFiles([path]);

    await expect(() => addWorkspace(path)).rejects.toThrow(
      InvalidParameterError,
    );
  });

  it('does nothing if the workspace is already in the store', async () => {
    WorkspacesStore.add(workspace_1);

    await addWorkspace(workspace_1.path);

    expect(WorkspacesStore.getAll()).toEqual([workspace_1]);
  });

  it('adds the workspace to the store if it is an existing workspace', async () => {
    await addWorkspace(workspace_1.path);

    expect(WorkspacesStore.get(workspace_1.id)).toEqual(workspace_1);
  });

  it('initializes the workspace if it is a new workspace', async () => {
    // Create the new workspace directory without any config
    MockFs.createDir(newWorkspacePath);

    await addWorkspace(newWorkspacePath);

    const config = MockFs.readJsonFile<Workspace>(
      getWorkspaceConfigFilePath(newWorkspacePath),
    );

    // Should write the workspace config
    expect(config).toMatchObject(omitPath(newWorkspace));
    // Should add the workspace to the store
    expect(WorkspacesStore.get(config.id)).toEqual(newWorkspace);
  });

  it('writes the workspaces config', async () => {
    MockFs.createDir(newWorkspacePath);

    await addWorkspace(newWorkspacePath);

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      getWorkspacesConfigFilePath(),
    );

    expect(config.paths.includes(newWorkspacePath)).toBe(true);
  });

  it('returns the new workspace', async () => {
    const result = await addWorkspace(workspace_1.path);

    expect(result).toEqual(workspace_1);
  });

  it('dispatches a workspaces loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(WorkspacesLoadedEvent, 'test', (payload) => {
        expect(payload.data).toMatchObject([workspace_1]);
        done();
      });

      addWorkspace(workspace_1.path);
    }));
});
