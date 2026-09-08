import { WorkspacesStore } from './WorkspacesStore';
import { DefaultWorkspaceIcon } from './constants';
import { WorkspaceNotFoundError } from './errors';
import {
  ActiveWorkspaceChangedEvent,
  WorkspaceCreatedEvent,
  WorkspaceDeletedEvent,
  WorkspaceUpdatedEvent,
  WorkspacesLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: WorkspaceCreatedEvent,
  Updated: WorkspaceUpdatedEvent,
  Deleted: WorkspaceDeletedEvent,
  Loaded: WorkspacesLoadedEvent,
  ActiveChanged: ActiveWorkspaceChangedEvent,
} as const;

export const errors = {
  NotFound: WorkspaceNotFoundError,
};

export const constants = {
  EntityDefaultIcon: DefaultWorkspaceIcon,
};

export { addWorkspace as add } from './addWorkspace';
export { createWorkspace as create } from './createWorkspace';
export { deleteWorkspace as delete } from './deleteWorkspace';
export { getActiveWorkspace as getActive } from './getActiveWorkspace';
export { getWorkspace as get } from './getWorkspace';
export { removeWorkspace as remove } from './removeWorkspace';
export { readWorkspaceConfig as readConfig } from './readWorkspaceConfig';
export { renameWorkspace as rename } from './renameWorkspace';
export { setActiveWorkspace as setActive } from './setActiveWorkspace';
export { initializeWorkspaces as initialize } from './initializeWorkspaces';
export { isWorkspaceDirectory as isWorkspace } from './utils';
export { updateWorkspace as update } from './updateWorkspace';
export { useActiveWorkspace as useActive } from './ActiveWorkspaceStore';
export {
  useWorkspace as use,
  useWorkspaces as useAll,
} from './WorkspacesStore';
export { writeWorkspaceConfig as writeConfig } from './writeWorkspaceConfig';
export { WorkspacesStore as Store } from './WorkspacesStore';
export { ActiveWorkspaceStore as ActiveStore } from './ActiveWorkspaceStore';

export const getAll = WorkspacesStore.getAllArray;
