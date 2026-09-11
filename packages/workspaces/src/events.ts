import { Workspace } from './types';

export const WorkspaceCreatedEvent = 'workspaces:workspace:created';
export const WorkspaceUpdatedEvent = 'workspaces:workspace:updated';
export const WorkspaceDeletedEvent = 'workspaces:workspace:deleted';
export const WorkspacesLoadedEvent = 'workspaces:loaded';
export const WorkspacesReorderedEvent = 'workspaces:reordered';
export const ActiveWorkspaceChangedEvent = 'workspaces:active-changed';

export type WorkspaceCreatedEventData = Workspace;
export type WorkspaceDeletedEventData = Workspace;
export type WorkspaceUpdatedEventData = {
  original: Workspace;
  updated: Workspace;
};
export type WorkspacesLoadedEventData = Workspace[];
export type WorkspacesReorderedEventData = Workspace[];
export type ActiveWorkspaceChangedEventData = Workspace;

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'workspaces:workspace:created': WorkspaceCreatedEventData;
    'workspaces:workspace:updated': WorkspaceUpdatedEventData;
    'workspaces:workspace:deleted': WorkspaceDeletedEventData;
    'workspaces:loaded': WorkspacesLoadedEventData;
    'workspaces:reordered': WorkspacesReorderedEventData;
    'workspaces:active-changed': ActiveWorkspaceChangedEventData;
  }
}
