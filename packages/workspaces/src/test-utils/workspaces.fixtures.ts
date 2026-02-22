import { BaseDirectory, Fs, MockFileDescriptor } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspacesConfigFileName } from '../constants';
import { Workspace } from '../types';

export const workspacesRootPath = 'path/to/workspaces';

function generateWorkspaceFixture(name: string, number: number): Workspace {
  return {
    id: `workspace-${number}`,
    name,
    path: `${workspacesRootPath}/${name}`,
    icon: 'content-icon:shapes:blue',
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
  };
}

export const workspace_1 = generateWorkspaceFixture('Workspace 1', 1);
export const workspace_2 = generateWorkspaceFixture('Workspace 2', 2);
export const workspace_3 = generateWorkspaceFixture('Workspace 3', 3);

export const workspaces = [workspace_1, workspace_2, workspace_3];

export const workspaceFiles: MockFileDescriptor[] = workspaces.map(
  (workspace) => ({
    path: `${workspace.path}/${Paths.hiddenDirName}/workspace.json`,
    textContent: JSON.stringify(workspace),
  }),
);

export const workspacesConfig = {
  paths: [workspace_1.path, workspace_2.path, workspace_3.path],
};

export const workspaceConfigFile: MockFileDescriptor = {
  path: Fs.concatPath(BaseDirectory.AppConfig, WorkspacesConfigFileName),
  textContent: JSON.stringify(workspacesConfig),
};
