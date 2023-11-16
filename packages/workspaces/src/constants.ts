import { BaseDirectory } from '@minddrop/file-system';
import {
  UserIconContentIcon,
  UserIconDefault,
  UserIconType,
} from '@minddrop/icons';
import { WorkspaceConfig } from './types';

export const WorkspacesConfigDir = BaseDirectory.AppConfig;
export const WorkspacesConfigFileName = 'workspaces.json';
export const WorkspaceConfigDirName = '.minddrop';
export const WorkspaceConfigFileName = 'workspace.json';

export const DefaultWorkspaceIcon: UserIconDefault = {
  type: UserIconType.Default,
};
export const MissingWorkspaceIcon: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  icon: 'alert-circle',
  color: 'red',
};

export const DefaultWorkspaceConfig: WorkspaceConfig = {
  icon: DefaultWorkspaceIcon,
};
export const MissingWorkspaceConfig: WorkspaceConfig = {
  icon: MissingWorkspaceIcon,
};
