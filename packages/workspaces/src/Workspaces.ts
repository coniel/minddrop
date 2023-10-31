import { addWorkspace } from './addWorkspace';
import { getWorkspaces } from './getWorkspaces';
import { getWorkspacesConfig } from './getWorkspacesConfig';
import { hasValidWorkspace } from './hasValidWorkspace';
import { hasWorkspacesConfig } from './hasWorkspacesConfig';
import { loadWorkspaces } from './loadWorkspaces';
import { WorkspacesApi } from './types';
import { workspaceExists } from './workspaceExists';

export const Workspaces: WorkspacesApi = {
  load: loadWorkspaces,
  add: addWorkspace,
  getAll: getWorkspaces,
  getConfig: getWorkspacesConfig,
  hasConfig: hasWorkspacesConfig,
  hasValidWorkspace: hasValidWorkspace,
  exists: workspaceExists,
};
