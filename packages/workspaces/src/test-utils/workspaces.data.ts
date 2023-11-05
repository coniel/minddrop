import { Workspace } from '../types';

export const workspace1: Workspace = {
  path: 'Users/foo/Documents/Workspace 1',
  exists: true,
  name: 'Workspace 1',
};

export const missingWorkspace: Workspace = {
  path: 'Users/foo/Documents/Workspace 2',
  exists: false,
  name: 'Workspace 2',
};

export const workspaces = [workspace1, missingWorkspace];
