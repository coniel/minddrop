import { addWorkspace } from './addWorkspace';
import { loadWorkspaces } from './loadWorkspaces';
import { WorkspacesApi } from './types';

export const Workspaces: WorkspacesApi = {
  load: loadWorkspaces,
  add: addWorkspace,
};
