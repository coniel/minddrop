import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import { Icons, UserIcon, UserIconType } from '@minddrop/icons';
import {
  DefaultWorkspaceIcon,
  MissingWorkspaceIcon,
  WorkspaceConfigDirName,
  WorkspaceConfigFileName,
  WorkspacesConfigDir,
  WorkspacesConfigFileName,
} from '../constants';
import { Workspace, WorkspaceConfig, WorkspacesConfig } from '../types';

export const workspace1Icon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};
export const workspace1: Workspace = {
  path: 'Users/foo/Documents/Workspace 1',
  exists: true,
  name: 'Workspace 1',
  icon: Icons.stringify(workspace1Icon),
};

export const missingWorkspaceIcon = MissingWorkspaceIcon;
export const missingWorkspace: Workspace = {
  path: 'Users/foo/Documents/Workspace 2',
  exists: false,
  name: 'Workspace 2',
  icon: Icons.stringify(missingWorkspaceIcon),
};

export const newWorkspaceIcon = DefaultWorkspaceIcon;
export const newWorkspace: Workspace = {
  path: 'Users/foo/Documents/New workspace',
  exists: true,
  name: 'New workspace',
  icon: Icons.stringify(newWorkspaceIcon),
};

export const workspace1Config: WorkspaceConfig = {
  icon: Icons.stringify(workspace1Icon),
};

export const workspace1ConfigPath = Fs.concatPath(
  workspace1.path,
  WorkspaceConfigDirName,
  WorkspaceConfigFileName,
);

export const workspacesConfig: WorkspacesConfig = {
  paths: [workspace1.path, missingWorkspace.path],
};

export const workspcesConfigFileDescriptor: MockFileDescriptor = {
  path: WorkspacesConfigFileName,
  textContent: JSON.stringify(workspacesConfig),
  options: { baseDir: WorkspacesConfigDir },
};

export const workspaces = [workspace1, missingWorkspace];
