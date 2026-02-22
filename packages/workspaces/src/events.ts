import { Workspace } from './types';

export const WorkspaceCreatedEvent = 'workspaces:workspace:created';
export const WorkspaceUpdatedEvent = 'workspaces:workspace:updated';
export const WorkspaceDeletedEvent = 'workspaces:workspace:deleted';
export const WorkspacesLoadedEvent = 'workspaces:loaded';

export type WorkspaceCreatedEventData = Workspace;
export type WorkspaceDeletedEventData = Workspace;
export type WorkspaceUpdatedEventData = {
  original: Workspace;
  updated: Workspace;
};
export type WorkspacesLoadedEventData = Workspace[];
