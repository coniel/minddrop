import { BaseDirectory } from '@minddrop/file-system';
import {
  Icons,
  UserIcon,
  UserIconContentIcon,
  UserIconType,
} from '@minddrop/icons';
import { WorkspaceConfig } from './types';

export const WorkspacesConfigDir = BaseDirectory.AppConfig;
export const WorkspacesConfigFileName = 'workspaces.json';
export const WorkspaceConfigDirName = '.minddrop';
export const WorkspaceConfigFileName = 'workspace.json';
export const WorkspaceCacheDirName = 'cache';

export const DefaultWorkspaceIcon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'folder',
  color: 'default',
};
export const MissingWorkspaceIcon: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  icon: 'alert-circle',
  color: 'red',
};

export const DefaultWorkspaceConfig: WorkspaceConfig = {
  icon: Icons.stringify(DefaultWorkspaceIcon),
};
export const MissingWorkspaceConfig: WorkspaceConfig = {
  icon: Icons.stringify(MissingWorkspaceIcon),
};
