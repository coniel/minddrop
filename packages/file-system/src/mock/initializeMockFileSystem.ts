/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerFileSystemAdapter } from '../FileSystem';
import { concatPath } from '../concatPath';
import { fileNameFromPath } from '../fileNameFromPath';
import { mockRenameFile } from '../mock/mockRenameFile';
import {
  BaseDirectory,
  FileSystem,
  FsDirOptions,
  FsEntry,
  FsFileOptions,
  MockFileDescriptor,
  MockFileSystem,
} from '../types';
import { mockAddFileEntry } from './mockAddFileEntry';
import { mockCopyFile } from './mockCopyFile';
import { mockExists } from './mockExists';
import { mockGetFileEntry } from './mockGetFileEntry';
import { mockRemoveFileEntry } from './mockRemoveFileEntry';

export function initializeMockFileSystem(
  filesToLoad: (MockFileDescriptor | string)[] = [],
): MockFileSystem {
  const init = initializeMockFsRoot([
    { path: BaseDirectory.AppData },
    { path: BaseDirectory.AppConfig },
    { path: BaseDirectory.Documents },
    ...filesToLoad,
  ]);

  // The mock file system root
  let root: FsEntry = init.root;
  // Files which have been moved to the mock OS trash
  let trash: FsEntry[] = [];
  // A { path: text-content } map of text file contents
  let textFileContents: Record<string, string> = init.textFileContents;
  // A { path: File } map of binary files
  let binaryFiles: Record<string, any> = init.binaryFiles;

  const MockFs: FileSystem = {
    getBaseDirPath: async (dir) => dir,
    convertFileSrc: (path) => path,
    isDirectory: async (path, options) => {
      const fileEntry = mockGetFileEntry(root, getFullPath(path, options));

      return !!fileEntry.children;
    },
    copyFile: async (path, copyPath, options) =>
      mockCopyFile(
        root,
        getFullPath(path, { baseDir: options?.fromPathBaseDir }),
        getFullPath(copyPath, { baseDir: options?.toPathBaseDir }),
      ),
    exists: async (path, options) =>
      mockExists(root, getFullPath(path, options)),
    readBinaryFile: () => {
      throw new Error('readBinaryFile mock not implemented');
    },
    readDir: async (path, options = {}) => {
      const dir = mockGetFileEntry(root, getFullPath(path, options));
      const children = dir.children as FsEntry[];

      return options.recursive
        ? children
        : children.map((child) => ({ ...child, children: [] }));
    },
    readTextFile: async (path, options) => {
      const fullPath = getFullPath(path, options);

      // Ensure file entry exists
      mockGetFileEntry(root, fullPath);

      return textFileContents[fullPath] || '';
    },
    removeDir: async (path, options) =>
      mockRemoveFileEntry(root, getFullPath(path, options)),
    removeFile: async (path, options) => {
      mockRemoveFileEntry(root, getFullPath(path, options));
      delete textFileContents[path];
    },
    rename: async (oldPath, newPath, options) => {
      mockRenameFile(
        root,
        getFullPath(oldPath, { baseDir: options?.oldPathBaseDir }),
        getFullPath(newPath, { baseDir: options?.newPathBaseDir }),
      );

      if (textFileContents[oldPath]) {
        textFileContents[newPath] = textFileContents[oldPath];
        delete textFileContents[oldPath];
      }

      if (binaryFiles[oldPath]) {
        binaryFiles[newPath] = binaryFiles[oldPath];
        delete binaryFiles[oldPath];
      }
    },
    writeBinaryFile: async (path, file, options) => {
      const fullPath = getFullPath(path, options);

      if (!mockExists(root, fullPath)) {
        mockAddFileEntry(root, {
          path: fullPath,
          name: fileNameFromPath(fullPath),
        });
      }

      binaryFiles[fullPath] = file;
    },
    writeTextFile: async (path, textContent, options) => {
      const fullPath = getFullPath(path, options);

      if (!mockExists(root, fullPath)) {
        mockAddFileEntry(root, {
          path: fullPath,
          name: fileNameFromPath(fullPath),
        });
      }

      textFileContents[fullPath] = textContent;
    },
    createDir: async (path, options) => {
      const fullPath = getFullPath(path, options);

      mockAddFileEntry(root, {
        path: fullPath,
        children: [],
        name: fileNameFromPath(fullPath),
      });
    },
    trashDir: async (path) => {
      const fullPath = getFullPath(path);
      const dir = mockGetFileEntry(root, fullPath);

      trash.push(dir);

      mockRemoveFileEntry(root, fullPath);
    },
    trashFile: async (path) => {
      const fullPath = getFullPath(path);
      const file = mockGetFileEntry(root, fullPath);

      trash.push(file);

      mockRemoveFileEntry(root, fullPath);

      delete textFileContents[fullPath];
      delete binaryFiles[fullPath];
    },
    downloadFile: async (url, path, options) => {
      const fullPath = getFullPath(path, options);

      if (!mockExists(root, fullPath)) {
        mockAddFileEntry(root, {
          path: fullPath,
          name: fileNameFromPath(fullPath),
        });
      }
    },
  };

  registerFileSystemAdapter(MockFs);

  return {
    MockFs,
    getFiles: () => root.children as FsEntry[],
    getTrash: () => trash,
    clear: () => {
      root = { path: 'root', name: 'root', children: [] };
      trash = [];
    },
    printFiles: () => {
      console.log('------------ MockFs files ------------');
      console.log(JSON.stringify(root, null, 2));
      console.log('--------------- Trash ----------------');
      console.log(JSON.stringify(trash, null, 2));
      console.log('-------- Text file contents ----------');
      console.log(JSON.stringify(textFileContents, null, 2));
      console.log('----------- Binary files -------------');
      console.log(binaryFiles);
      console.log('--------------------------------------');
    },
    reset: () => {
      const init = initializeMockFsRoot(filesToLoad);
      root = init.root;
      textFileContents = init.textFileContents;
      binaryFiles = init.binaryFiles;
      trash = [];
    },
    clearTrash: () => {
      trash = [];
    },
    setFiles: (filesToLoad) => {
      const init = initializeMockFsRoot(filesToLoad);
      root = init.root;
      textFileContents = init.textFileContents;
      binaryFiles = init.binaryFiles;
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

      binaryFiles = {
        ...binaryFiles,
        ...init.binaryFiles,
      };
    },
    exists: (path, options) => mockExists(root, getFullPath(path, options)),
    existsInTrash: (path, options) =>
      !!trash.find(
        (fileEntry) => fileEntry.path === getFullPath(path, options),
      ),
    readTextFile: (path, options) => {
      const fullPath = getFullPath(path, options);

      // Ensure file entry exists
      mockGetFileEntry(root, fullPath);

      return textFileContents[fullPath] || '';
    },
    writeTextFile: (path, textContent, options) => {
      const fullPath = getFullPath(path, options);

      if (!mockExists(root, fullPath)) {
        mockAddFileEntry(root, {
          path: fullPath,
          name: fileNameFromPath(fullPath),
        });
      }

      textFileContents[fullPath] = textContent;
    },
    removeFile: (path, options) =>
      mockRemoveFileEntry(root, getFullPath(path, options)),
    removeDir: (path, options) =>
      mockRemoveFileEntry(root, getFullPath(path, options)),
    downloadFile: (url, path, options) => {
      const fullPath = getFullPath(path, options);

      if (!mockExists(root, fullPath)) {
        mockAddFileEntry(root, {
          path: fullPath,
          name: fileNameFromPath(fullPath),
        });
      }
    },
  };
}

function initializeMockFsRoot(
  fileDescriptors: (MockFileDescriptor | string)[],
): {
  root: FsEntry;
  textFileContents: Record<string, string>;
  binaryFiles: Record<string, any>;
} {
  const root: FsEntry = { path: 'root', name: 'root', children: [] };
  const textFileContents: Record<string, string> = {};
  const binaryFiles: Record<string, any> = {};

  fileDescriptors.forEach((fileDescriptor) => {
    const path =
      typeof fileDescriptor === 'string'
        ? fileDescriptor
        : getFullPath(fileDescriptor.path, fileDescriptor.options);
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
      if (fileDescriptor.textContent) {
        textFileContents[path] = fileDescriptor.textContent;
      }

      if (fileDescriptor.binaryFile) {
        binaryFiles[path] = fileDescriptor.binaryFile;
      }
    }
  });

  return { root, textFileContents, binaryFiles };
}

function addToFileTree(root: FsEntry, file: FsEntry) {
  if (!mockExists(root, file.path)) {
    mockAddFileEntry(root, file);
  } else if (file.children) {
    file.children.forEach((child) => addToFileTree(root, child));
  }
}

function getFullPath(
  path: string,
  options?: FsFileOptions | FsDirOptions,
): string {
  return options?.baseDir ? concatPath(options.baseDir, path) : path;
}
