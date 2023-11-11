import { WorkspacesStore } from './WorkspacesStore';

export { loadWorkspaces as load } from './loadWorkspaces';
export { addWorkspace as add } from './addWorkspace';
export { createWorkspace as create } from './createWorkspace';
export { getWorkspaces as getAll } from './getWorkspaces';
export { getWorkspacesConfig as getConfig } from './getWorkspacesConfig';
export { hasValidWorkspace } from './hasValidWorkspace';
export { hasWorkspacesConfig as hasConfig } from './hasWorkspacesConfig';
export { workspaceExists as exists } from './workspaceExists';
export { getWorkspace as get } from './getWorkspace';
export { getWorkspaceConfig } from './getWorkspaceConfig';
export { removeWorkspace as remove } from './removeWorkspace';
export { deleteWorkspace as delete } from './deleteWorkspace';
export { moveWorkspace as move } from './moveWorkspace';
export { renameWorkspace as rename } from './renameWorkspace';
export { setWorkpaceIcon as setIcon } from './setWorkpaceIcon';

export function _clear() {
  WorkspacesStore.getState().clear();
}
