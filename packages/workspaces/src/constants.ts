import {
  UserIconContentIcon,
  UserIconDefault,
  UserIconType,
} from '@minddrop/icons';
import { WorkspaceConfig } from './types';

export const WorkspacesConfigFile = 'workspaces.json';
export const WorkspaceConfigDir = '.minddrop';
export const WorkspaceConfigFile = 'workspace.json';

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
