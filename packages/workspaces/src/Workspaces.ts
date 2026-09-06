import { WorkspacesStore } from './WorkspacesStore';
import { DefaultWorkspaceIcon } from './constants';
import { WorkspaceNotFoundError } from './errors';
import {
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
export { getWorkspace as get } from './getWorkspace';
export { removeWorkspace as remove } from './removeWorkspace';
export { readWorkspaceConfig as readConfig } from './readWorkspaceConfig';
export { renameWorkspace as rename } from './renameWorkspace';
export { initializeWorkspaces as initialize } from './initializeWorkspaces';
export { isWorkspaceDirectory as isWorkspace } from './utils';
export { updateWorkspace as update } from './updateWorkspace';
export {
  useWorkspace as use,
  useWorkspaces as useAll,
} from './WorkspacesStore';
export { writeWorkspaceConfig as writeConfig } from './writeWorkspaceConfig';
export { WorkspacesStore as Store } from './WorkspacesStore';

export const getAll = WorkspacesStore.getAllArray;
