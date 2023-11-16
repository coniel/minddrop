import { fileNameFromPath } from '../fileNameFromPath';
import {
  FileEntry,
  FileSystem,
  MockFileDescriptor,
  MockFileSystem,
} from '../types';
import { registerFileSystemAdapter } from '../FileSystem';
import { mockRenameFile } from '../mock/mockRenameFile';
import { mockCopyFile } from './mockCopyFile';
import { mockExists } from './mockExists';
import { mockGetFileEntry } from './mockGetFileEntry';
import { mockRemoveFileEntry } from './mockRemoveFileEntry';
import { mockAddFileEntry } from './mockAddFileEntry';

export function initializeMockFileSystem(
  filesToLoad: MockFileDescriptor[] = [],
): MockFileSystem {
  const init = initializeMockFsRoot(filesToLoad);

  // The mock file system root
  let root: FileEntry = init.root;
  // Files which have been moved to the mock OS trash
  let trash: FileEntry[] = [];
  // A { path: text-content } map of text file contents
  let textFileContents: Record<string, string> = init.textFileContents;

  const MockFs: FileSystem = {
    getDirPath: async (dir) => dir,
    copyFile: async (path, copyPath) => mockCopyFile(root, path, copyPath),
    exists: async (path) => mockExists(root, path),
    readBinaryFile: () => {
      throw new Error('readBinaryFile mock not implemented');
    },
    readDir: async (path, options = {}) => {
      const dir = mockGetFileEntry(root, path);
      const children = dir.children as FileEntry[];

      return options.recursive
        ? children
        : children.map((child) => ({ ...child, children: [] }));
    },
    readTextFile: async (path) => {
      // Ensure file entry exists
      mockGetFileEntry(root, path);

      return textFileContents[path] || '';
    },
    removeDir: async (path) => mockRemoveFileEntry(root, path),
    removeFile: async (path) => {
      mockRemoveFileEntry(root, path);
      delete textFileContents[path];
    },
    renameFile: async (oldPath, newPath) =>
      mockRenameFile(root, oldPath, newPath),
    writeBinaryFile: () => {
      throw new Error('writeBinaryFile mock not implemented');
    },
    writeTextFile: async (path, textContent) => {
      if (!mockExists(root, path)) {
        mockAddFileEntry(root, { path, name: fileNameFromPath(path) });
      }
      textFileContents[path] = textContent;
    },
    createDir: async (path: string) => {
      mockAddFileEntry(root, {
        path,
        children: [],
        name: fileNameFromPath(path),
      });
    },
    trashDir: async (path: string) => {
      const dir = mockGetFileEntry(root, path);
      trash.push(dir);
      mockRemoveFileEntry(root, path);
    },
    trashFile: async (path: string) => {
      const file = mockGetFileEntry(root, path);
      trash.push(file);
      mockRemoveFileEntry(root, path);
      delete textFileContents[path];
    },
  };

  registerFileSystemAdapter(MockFs);

  return {
    MockFs,
    getFiles: () => root.children as FileEntry[],
    getTrash: () => trash,
    clearMockFileSystem: () => {
      root = { path: 'root', name: 'root', children: [] };
      trash = [];
    },
    printFiles: () => {
      console.log('------------ MockFs files ------------');
      console.log(JSON.stringify(root, null, 2));
      console.log('--------------- Trash ----------------');
      console.log(JSON.stringify(trash, null, 2));
      console.log('--------------------------------------');
    },
    resetMockFileSystem: () => {
      const init = initializeMockFsRoot(filesToLoad);
      root = init.root;
      textFileContents = init.textFileContents;
      trash = [];
    },
    clearTrash: () => {
      trash = [];
    },
    setFiles: (filesToLoad) => {
      const init = initializeMockFsRoot(filesToLoad);
      root = init.root;
      textFileContents = init.textFileContents;
    },
    addFiles: (filesToLoad) => {
      const init = initializeMockFsRoot(filesToLoad);

      init.root.children?.forEach((child) => {
        addToFileTree(root, child);
      });

      textFileContents = {
        ...textFileContents,
        ...init.textFileContents,
      };
    },
    exists: (path) => mockExists(root, path),
    readTextFile: (path) => {
      // Ensure file entry exists
      mockGetFileEntry(root, path);

      return textFileContents[path] || '';
    },
    writeTextFile: (path, textContent) => {
      if (!mockExists(root, path)) {
        mockAddFileEntry(root, { path, name: fileNameFromPath(path) });
      }
      textFileContents[path] = textContent;
    },
  };
}

function initializeMockFsRoot(fileDescriptors: MockFileDescriptor[]): {
  root: FileEntry;
  textFileContents: Record<string, string>;
} {
  const root: FileEntry = { path: 'root', name: 'root', children: [] };
  const textFileContents: Record<string, string> = {};

  fileDescriptors.forEach((fileDescriptor) => {
    const path =
      typeof fileDescriptor === 'string' ? fileDescriptor : fileDescriptor.path;
    const pathParts = path.split('/');

    let currentPath = '';

    pathParts.forEach((part) => {
      currentPath = `${currentPath}${part}`;

      if (!mockExists(root, currentPath)) {
        mockAddFileEntry(root, {
          path: currentPath,
          name: part,
          children:
            part.includes('.') && !part.startsWith('.') ? undefined : [],
        });
      }

      currentPath = `${currentPath}/`;
    });

    if (typeof fileDescriptor !== 'string') {
      textFileContents[fileDescriptor.path] = fileDescriptor.textContent;
    }
  });

  return { root, textFileContents };
}

function addToFileTree(root: FileEntry, file: FileEntry) {
  if (!mockExists(root, file.path)) {
    mockAddFileEntry(root, file);
  } else if (file.children) {
    file.children.forEach((child) => addToFileTree(root, child));
  }
}
