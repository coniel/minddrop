import { FileEntry } from '../types';

export const pageA1: FileEntry = {
  path: 'Documents/Workspace A/Page 1.md',
  name: 'Page 1.md',
};

export const pageA2: FileEntry = {
  path: 'Documents/Workspace A/Page 2.md',
  name: 'Page 2.md',
};

export const pageA3: FileEntry = {
  path: 'Documents/Workspace A/Page A3.md',
  name: 'Page A3.md',
};

export const workspaceA: FileEntry = {
  path: 'Documents/Workspace A',
  name: 'Workspace A',
  children: [pageA1, pageA2, pageA3],
};

export const pageB1: FileEntry = {
  path: 'Documents/Workspace B/Page 1.md',
  name: 'Page 1.md',
};

export const pageB2: FileEntry = {
  path: 'Documents/Workspace B/Page 2.md',
  name: 'Page 2.md',
};

export const pageB3: FileEntry = {
  path: 'Documents/Workspace B/Page B3.md',
  name: 'Page B3.md',
};

export const workspaceB: FileEntry = {
  path: 'Documents/Workspace B',
  name: 'Workspace B',
  children: [pageB1, pageB2, pageB3],
};

export const documents: FileEntry = {
  path: 'Documents',
  name: 'Documents',
  children: [workspaceA, workspaceB],
};

export const root: FileEntry = {
  path: 'root',
  name: 'root',
  children: [documents],
};

export const createTestFsRoot = (): FileEntry =>
  JSON.parse(JSON.stringify(root));
