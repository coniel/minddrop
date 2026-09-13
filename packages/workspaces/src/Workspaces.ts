import { WorkspaceLoadersRegistry } from './WorkspaceLoadersRegistry';
import { WorkspacesStore } from './WorkspacesStore';
import { DefaultWorkspaceIcon } from './constants';
import { WorkspaceNotFoundError } from './errors';
import {
  ActiveWorkspaceChangedEvent,
  WorkspaceCreatedEvent,
  WorkspaceDeletedEvent,
  WorkspaceLoadedEvent,
  WorkspaceUpdatedEvent,
  WorkspacesLoadedEvent,
  WorkspacesReorderedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: WorkspaceCreatedEvent,
  Updated: WorkspaceUpdatedEvent,
  Deleted: WorkspaceDeletedEvent,
  Loaded: WorkspacesLoadedEvent,
  Reordered: WorkspacesReorderedEvent,
  ActiveChanged: ActiveWorkspaceChangedEvent,
  WorkspaceLoaded: WorkspaceLoadedEvent,
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
export { getLoadedWorkspaces as getLoaded } from './getLoadedWorkspaces';
export { isWorkspaceLoaded as isLoaded } from './isWorkspaceLoaded';
export { loadWorkspace as load } from './loadWorkspace';
export { removeWorkspace as remove } from './removeWorkspace';
export { reorderWorkspaces as reorder } from './reorderWorkspaces';
export { readWorkspaceConfig as readConfig } from './readWorkspaceConfig';
export { renameWorkspace as rename } from './renameWorkspace';
export { setActiveWorkspace as setActive } from './setActiveWorkspace';
export { initializeWorkspaces as initialize } from './initializeWorkspaces';
export {
  isWorkspaceDirectory as isWorkspace,
  resolveWorkspaceConfigDirPath as resolveConfigDirPath,
  resolveWorkspaceDataDirPath as resolveDataDirPath,
  resolveWorkspacePath as resolvePath,
} from './utils';
export { updateWorkspace as update } from './updateWorkspace';
export { useActiveWorkspace as useActive } from './ActiveWorkspaceStore';
export {
  useWorkspace as use,
  useWorkspaces as useAll,
} from './WorkspacesStore';
export { writeWorkspaceConfig as writeConfig } from './writeWorkspaceConfig';
export { WorkspacesStore as Store } from './WorkspacesStore';
export { ActiveWorkspaceStore as ActiveStore } from './ActiveWorkspaceStore';
export { LoadedWorkspacesStore as LoadedStore } from './LoadedWorkspacesStore';

export const { register: registerLoader, unregister: unregisterLoader } =
  WorkspaceLoadersRegistry;

export const getAll = WorkspacesStore.getAllArray;
