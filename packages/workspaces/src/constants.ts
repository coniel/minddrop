import {
  WorkspaceConfig,
  WorkspaceIconContentIcon,
  WorkspaceIconDefault,
  WorkspaceIconType,
} from './types';

export const WorkspacesConfigFile = 'workspaces.json';
export const WorkspaceConfigDir = '.minddrop';
export const WorkspaceConfigFile = 'workspace.json';

export const DefaultWorkspaceIcon: WorkspaceIconDefault = {
  type: WorkspaceIconType.Default,
};
export const MissingWorkspaceIcon: WorkspaceIconContentIcon = {
  type: WorkspaceIconType.ContentIcon,
  icon: 'alert-circle',
  color: 'red',
};

export const DefaultWorkspaceConfig: WorkspaceConfig = {
  icon: DefaultWorkspaceIcon,
};
export const MissingWorkspaceConfig: WorkspaceConfig = {
  icon: MissingWorkspaceIcon,
};
