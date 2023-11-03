import { WorkspacesApi } from './types';
import { addWorkspace } from './addWorkspace';
import { createWorkspace } from './createWorkspace';
import { getWorkspaces } from './getWorkspaces';
import { getWorkspacesConfig } from './getWorkspacesConfig';
import { hasValidWorkspace } from './hasValidWorkspace';
import { hasWorkspacesConfig } from './hasWorkspacesConfig';
import { loadWorkspaces } from './loadWorkspaces';
import { workspaceExists } from './workspaceExists';
import { WorkspacesStore } from './WorkspacesStore';
import { getWorkspace } from './getWorkspace';

export const Workspaces: WorkspacesApi = {
  load: loadWorkspaces,
  add: addWorkspace,
  create: createWorkspace,
  getAll: getWorkspaces,
  get: getWorkspace,
  getConfig: getWorkspacesConfig,
  hasConfig: hasWorkspacesConfig,
  hasValidWorkspace: hasValidWorkspace,
  exists: workspaceExists,
  _clear: () => WorkspacesStore.getState().clear(),
};
