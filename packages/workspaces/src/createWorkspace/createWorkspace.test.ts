import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { omitPath } from '@minddrop/utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  setup,
  workspace_1,
  workspacesRootPath,
} from '../test-utils';
import { WorkspacesConfig } from '../types';
import {
  getWorkspaceConfigFilePath,
  getWorkspacesConfigFilePath,
} from '../utils';
import { createWorkspace } from './createWorkspace';

const options = {
  name: 'New workspace',
  icon: 'content-icon:shapes:blue',
};
const path = `${workspacesRootPath}/${options.name}`;

const newWorkspace = {
  ...options,
  path,
  id: expect.any(String),
  created: expect.any(Date),
  lastModified: expect.any(Date),
};

describe('createWorkspace', () => {
  beforeEach(() => setup({ loadWorkspacesConfig: false }));

  afterEach(cleanup);

  it('throws if the workspace directory already exists', async () => {
    // Then, try to create a workspace where one already exists
    await expect(() =>
      createWorkspace(Fs.parentDirPath(workspace_1.path), {
        name: workspace_1.name,
        icon: 'content-icon:shapes:blue',
      }),
    ).rejects.toThrow(PathConflictError);
  });

  it('creates the workspace directory', async () => {
    await createWorkspace(workspacesRootPath, options);

    expect(MockFs.exists(path)).toBe(true);
  });

  it('returns the new workspace', async () => {
    const result = await createWorkspace(workspacesRootPath, options);

    expect(result).toMatchObject(newWorkspace);
  });

  it('adds the workspace to the store', async () => {
    const result = await createWorkspace(workspacesRootPath, options);

    const workspace = WorkspacesStore.get(result.id);

    expect(workspace).toMatchObject(newWorkspace);
  });

  it('writes the workspace config to the file system', async () => {
    const result = await createWorkspace(workspacesRootPath, options);

    const config = MockFs.readJsonFile(getWorkspaceConfigFilePath(result.path));

    expect(config).toEqual(omitPath(newWorkspace));
  });

  it('writes the workspaces config', async () => {
    await createWorkspace(workspacesRootPath, options);

    const config = MockFs.readJsonFile<WorkspacesConfig>(
      getWorkspacesConfigFilePath(),
    );

    expect(config.paths.includes(path)).toBe(true);
  });

  it('dispatches a workspace created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(WorkspaceCreatedEvent, 'test', (payload) => {
        expect(payload.data).toMatchObject(newWorkspace);
        done();
      });

      createWorkspace(workspacesRootPath, options);
    }));
});
