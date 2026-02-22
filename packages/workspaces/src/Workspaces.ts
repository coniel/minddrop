import { WorkspacesStore } from './WorkspacesStore';

export { addWorkspace as add } from './addWorkspace';
export { createWorkspace as create } from './createWorkspace';
export { deleteWorkspace as delete } from './deleteWorkspace';
export { getWorkspace as get } from './getWorkspace';
export { removeWorkspace as remove } from './removeWorkspace';
export { readWorkspaceConfig as readConfig } from './readWorkspaceConfig';
export { renameWorkspace as rename } from './renameWorkspace';
export { initializeWorkspaces as initialize } from './initializeWorkspaces';
export { updateWorkspace as update } from './updateWorkspace';
export {
  useWorkspace as use,
  useWorkspaces as useAll,
} from './WorkspacesStore';
export { writeWorkspaceConfig as writeConfig } from './writeWorkspaceConfig';
export { WorkspacesStore as Store } from './WorkspacesStore';

export const getAll = WorkspacesStore.getAll;
