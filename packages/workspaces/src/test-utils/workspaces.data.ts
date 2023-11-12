import { UserIconType } from '@minddrop/icons';
import { DefaultWorkspaceIcon, MissingWorkspaceIcon } from '../constants';
import { Workspace, WorkspaceConfig } from '../types';

export const workspace1: Workspace = {
  path: 'Users/foo/Documents/Workspace 1',
  exists: true,
  name: 'Workspace 1',
  icon: { type: UserIconType.ContentIcon, icon: 'cat', color: 'cyan' },
};

export const missingWorkspace: Workspace = {
  path: 'Users/foo/Documents/Workspace 2',
  exists: false,
  name: 'Workspace 2',
  icon: MissingWorkspaceIcon,
};

export const newWorkspace: Workspace = {
  path: 'Users/foo/Documents/New workspace',
  exists: true,
  name: 'New workspace',
  icon: DefaultWorkspaceIcon,
};

export const workspace1Config: WorkspaceConfig = {
  icon: { type: UserIconType.ContentIcon, icon: 'cat', color: 'cyan' },
};

export const workspaces = [workspace1, missingWorkspace];
