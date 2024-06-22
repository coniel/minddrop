import { FsEntry, MockFileDescriptor } from '../types';
import { ConfigsFile, ConfigsFileOptions } from '../constants';

export const configsFileDescriptor: MockFileDescriptor = {
  path: ConfigsFile,
  options: ConfigsFileOptions,
};

export const documentA1: FsEntry = {
  path: 'Documents/Workspace A/Document 1.md',
  name: 'Document 1.md',
};

export const documentA2: FsEntry = {
  path: 'Documents/Workspace A/Document 2.md',
  name: 'Document 2.md',
};

export const documentA3: FsEntry = {
  path: 'Documents/Workspace A/Document A3.md',
  name: 'Document A3.md',
};

export const workspaceA: FsEntry = {
  path: 'Documents/Workspace A',
  name: 'Workspace A',
  children: [documentA1, documentA2, documentA3],
};

export const documentB1: FsEntry = {
  path: 'Documents/Workspace B/Document 1.md',
  name: 'Document 1.md',
};

export const documentB2: FsEntry = {
  path: 'Documents/Workspace B/Document 2.md',
  name: 'Document 2.md',
};

export const documentB3: FsEntry = {
  path: 'Documents/Workspace B/Document B3.md',
  name: 'Document B3.md',
};

export const workspaceB: FsEntry = {
  path: 'Documents/Workspace B',
  name: 'Workspace B',
  children: [documentB1, documentB2, documentB3],
};

export const documents: FsEntry = {
  path: 'Documents',
  name: 'Documents',
  children: [workspaceA, workspaceB],
};

export const root: FsEntry = {
  path: 'root',
  name: 'root',
  children: [documents],
};

export const createTestFsRoot = (): FsEntry => JSON.parse(JSON.stringify(root));
