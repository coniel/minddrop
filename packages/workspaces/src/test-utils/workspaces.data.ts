import { Workspace } from '../types';

export const workspace1: Workspace = {
  path: 'Users/foo/Documents/Workspace 1',
  exists: true,
  name: 'Workspace 1',
  topics: [
    '/Users/foo/Documents/Workspace 1/Topic 1.md',
    'Users/foo/Documents/Workspace 1/Topic 2/Topic 2.md',
  ],
};

export const workspace2: Workspace = {
  path: 'Users/foo/Documents/Workspace 2',
  exists: false,
  name: 'Workspace 2',
  topics: [],
};

export const workspaces = [workspace1, workspace2];
