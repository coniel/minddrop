/* eslint-disable @typescript-eslint/no-explicit-any */
import { YAML, restoreDates } from '@minddrop/utils';
import { registerFileSystemAdapter } from '../../FileSystem';
import { fileNameFromPath } from '../../fileNameFromPath';
import { isAtOrUnder } from '../../isAtOrUnder';
import {
  BaseDirectory,
  FileSystemAdapter,
  FsEntry,
  FsReadFileOptions,
  FsWatchEvent,
  MockFileDescriptor,
  MockFileStats,
  MockFileSystem,
  MockFileSystemOptions,
} from '../../types';
import { clearMockContents } from '../clearMockContents';
import { copyMockContents } from '../copyMockContents';
import { mockAddFileEntry } from '../mockAddFileEntry';
import { mockCopyFile } from '../mockCopyFile';
import { mockExists } from '../mockExists';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { mockRemoveDirEntry } from '../mockRemoveDirEntry';
import { mockRemoveFileEntry } from '../mockRemoveFileEntry';
import { mockRenameFile } from '../mockRenameFile';
import { printFileTree } from '../printFileTree';
import { rekeyMockContents } from '../rekeyMockContents';
import { resolveMockPath } from '../resolveMockPath';
import { resolveMockPathKey } from '../resolveMockPathKey';

const baseDirs = [
  BaseDirectory.AppData,
  BaseDirectory.AppConfig,
  BaseDirectory.Documents,
];

/**
 * Initializes a mock file system with the given files and registers it
 * as the file system adapter. Paths which differ only in case or
 * Unicode normalisation form are the same file, as on macOS and
 * Windows. A case-sensitive file system treats them as different
 * files.
 *
 * @param filesToLoad - The files to load into the file system.
 * @param options - The file system's path matching options.
 * @returns The mock file system.
 */
export function initializeMockFileSystem(
  filesToLoad: (MockFileDescriptor | string)[] = [],
  options: MockFileSystemOptions = {},
): MockFileSystem {
  // The path matching options passed to every lookup
  const matching: MockFileSystemOptions = {
    caseSensitive: options.caseSensitive,
  };
  // Build the initial file tree, contents and stats
  const init = initializeMockFsRoot([...baseDirs, ...filesToLoad], matching);

  // The mock file system root
  let root: FsEntry = init.root;
  // Files which have been moved to the mock OS trash
  let trash: FsEntry[] = [];
  // A { path: text-content } map of text file contents
  let textFileContents: Record<string, string> = init.textFileContents;
  // A { path: File } map of binary files
  let binaryFiles: Record<string, any> = init.binaryFiles;
  // A { path: stats } map of file stats
  let fileStats: Record<string, MockFileStats> = init.fileStats;
  // Result of the file picker
  let filePickerResult: string | string[] | null = null;
  // Watch callbacks keyed by watcher ID
  const watchCallbacks = new Map<
    string,
    { paths: string[]; callback: (event: FsWatchEvent) => void }
  >();
  // ID given to the next watcher
  let nextWatcherId = 0;

  // Resolves the key under which a path's contents and stats are stored
  const key = (path: string): string => resolveMockPathKey(path, matching);

  // Returns the size in bytes of a mock file's contents
  const mockContentsSize = (path: string): number => {
    // Measure a text file's encoded contents
    if (key(path) in textFileContents) {
      return new TextEncoder().encode(textFileContents[key(path)]).length;
    }

    // Otherwise use the binary file's size, if any
    return binaryFiles[key(path)]?.size ?? 0;
  };

  // Deletes the contents and stats of a removed path, along with those
  // of everything below it when a directory was removed.
  const clearContents = (path: string): void => {
    [textFileContents, binaryFiles, fileStats].forEach((contents) =>
      clearMockContents(contents, key(path)),
    );
  };

  const MockFs: FileSystemAdapter = {
    resolveBaseDirPath: async (baseDir) => baseDir,
    convertFileSrc: (path) => path,
    openFilePicker: async () => {
      return filePickerResult as any;
    },
    isDirectory: async (path, options) => {
      const fileEntry = mockGetFileEntry(
        root,
        resolveMockPath(path, options),
        matching,
      );

      return !!fileEntry.children;
    },
    copyFile: async (path, copyPath, options) => {
      // Resolve the copied path
      const fullPath = resolveMockPath(path, {
        baseDir: options?.fromPathBaseDir,
      });
      // Resolve the copy's path
      const fullCopyPath = resolveMockPath(copyPath, {
        baseDir: options?.toPathBaseDir,
      });

      // Copy the file tree entry
      mockCopyFile(root, fullPath, fullCopyPath, matching);

      // Copy the contents and stats of the copied path, along with those
      // of everything below it when a directory was copied.
      [textFileContents, binaryFiles, fileStats].forEach((contents) =>
        copyMockContents(contents, key(fullPath), key(fullCopyPath)),
      );
    },
    exists: async (path, options) =>
      mockExists(root, resolveMockPath(path, options), matching),
    readDir: async (path, options = {}) => {
      const dir = mockGetFileEntry(
        root,
        resolveMockPath(path, options),
        matching,
      );

      // Ensure the path is a directory
      if (!dir.children) {
        throw new Error(
          `Mock FS error: cannot read dir ${path}, path is not a dir`,
        );
      }

      return dir.children;
    },
    readTextFile: async (path, options) => {
      const fullPath = resolveMockPath(path, options);

      // Ensure file entry exists
      mockGetFileEntry(root, fullPath, matching);

      return textFileContents[key(fullPath)] || '';
    },
    readTextFiles: async (paths, options) => {
      const results = new Map<string, string>();

      for (const path of paths) {
        const fullPath = resolveMockPath(path, options);

        try {
          mockGetFileEntry(root, fullPath, matching);
          results.set(path, textFileContents[key(fullPath)] || '');
        } catch {
          // Skip paths that fail (partial success)
        }
      }

      return results;
    },
    removeDir: async (path, options) => {
      const fullPath = resolveMockPath(path, options);

      mockRemoveDirEntry(root, fullPath, {
        ...matching,
        recursive: options?.recursive,
      });

      // Remove the contents and stats of the directory's files
      clearContents(fullPath);
    },
    removeFile: async (path, options) => {
      // Resolve the file's path
      const fullPath = resolveMockPath(path, options);

      // Remove the file tree entry
      mockRemoveFileEntry(root, fullPath, matching);

      // Remove the file's contents and stats
      clearContents(fullPath);
    },
    rename: async (oldPath, newPath, options) => {
      // Resolve the old path
      const oldFullPath = resolveMockPath(oldPath, {
        baseDir: options?.oldPathBaseDir,
      });
      // Resolve the new path
      const newFullPath = resolveMockPath(newPath, {
        baseDir: options?.newPathBaseDir,
      });

      // Move the file tree entry
      mockRenameFile(root, oldFullPath, newFullPath, matching);

      // Re-key the renamed path's contents and stats, along with those
      // of everything below it when a directory was renamed.
      [textFileContents, binaryFiles, fileStats].forEach((contents) =>
        rekeyMockContents(contents, key(oldFullPath), key(newFullPath)),
      );
    },
    writeBinaryFile: async (path, file, options) => {
      const fullPath = resolveMockPath(path, options);

      if (!mockExists(root, fullPath, matching)) {
        mockAddFileEntry(
          root,
          { path: fullPath, name: fileNameFromPath(fullPath) },
          matching,
        );
      }

      binaryFiles[key(fullPath)] = file;
    },
    writeTextFile: async (path, textContent, options) => {
      const fullPath = resolveMockPath(path, options);

      if (!mockExists(root, fullPath, matching)) {
        mockAddFileEntry(
          root,
          { path: fullPath, name: fileNameFromPath(fullPath) },
          matching,
        );
      }

      textFileContents[key(fullPath)] = textContent;
    },
    writeTextFiles: async (entries, options) => {
      for (const entry of entries) {
        const fullPath = resolveMockPath(entry.path, options);

        if (!mockExists(root, fullPath, matching)) {
          mockAddFileEntry(
            root,
            { path: fullPath, name: fileNameFromPath(fullPath) },
            matching,
          );
        }

        textFileContents[key(fullPath)] = entry.contents;
      }
    },
    createDir: async (path, options) => {
      const fullPath = resolveMockPath(path, options);

      if (options?.recursive) {
        const dirs = path.split('/');
        let currentPath = '';

        dirs.forEach((dir) => {
          currentPath = `${currentPath}${dir}`;

          if (!mockExists(root, currentPath, matching)) {
            mockAddFileEntry(
              root,
              { path: currentPath, children: [], name: dir },
              matching,
            );
          }

          currentPath = `${currentPath}/`;
        });
      } else {
        // A non-recursive create fails on an existing path, matching
        // the OS behaviour which makes check-then-create races throw.
        if (mockExists(root, fullPath, matching)) {
          throw new Error(`EEXIST: file already exists, mkdir '${fullPath}'`);
        }

        mockAddFileEntry(
          root,
          { path: fullPath, children: [], name: fileNameFromPath(fullPath) },
          matching,
        );
      }
    },
    trashDir: async (path) => {
      const fullPath = resolveMockPath(path);
      const dir = mockGetFileEntry(root, fullPath, matching);

      trash.push(dir);

      mockRemoveFileEntry(root, fullPath, matching);

      // Remove the contents and stats of the directory's files
      clearContents(fullPath);
    },
    trashFile: async (path) => {
      const fullPath = resolveMockPath(path);
      const file = mockGetFileEntry(root, fullPath, matching);

      trash.push(file);

      mockRemoveFileEntry(root, fullPath, matching);

      // Remove the file's contents and stats
      clearContents(fullPath);
    },
    downloadFile: async (_, path, options) => {
      const fullPath = resolveMockPath(path, options);

      if (!mockExists(root, fullPath, matching)) {
        mockAddFileEntry(
          root,
          { path: fullPath, name: fileNameFromPath(fullPath) },
          matching,
        );
      }
    },
    watch: async (watchPaths, callback) => {
      const id = String(nextWatcherId++);
      watchCallbacks.set(id, { paths: watchPaths, callback });

      return id;
    },
    unwatch: async (id) => {
      watchCallbacks.delete(id);
    },
    stat: async (path) => {
      const fullPath = resolveMockPath(path);

      // Ensure file entry exists
      mockGetFileEntry(root, fullPath, matching);

      // Get the configured stats or default dates
      const stats = fileStats[key(fullPath)] ?? {
        created: new Date('2024-01-01T00:00:00.000Z'),
        lastModified: new Date('2024-01-01T00:00:00.000Z'),
      };

      // Fill in the size of the file's contents unless one was
      // configured.
      return {
        ...stats,
        size: stats.size ?? mockContentsSize(fullPath),
      };
    },
  };

  /**
   * Restores the file tree, contents and stats to the initially
   * loaded files.
   */
  function reset(): void {
    const init = initializeMockFsRoot([...baseDirs, ...filesToLoad], matching);
    root = init.root;
    textFileContents = init.textFileContents;
    binaryFiles = init.binaryFiles;
    trash = [];
    fileStats = init.fileStats;
    watchCallbacks.clear();
  }

  // Skip the I/O queue in tests since the mock adapter is
  // synchronous and the queue's debounce delay would cause
  // test timeouts.
  registerFileSystemAdapter(MockFs, { skipQueue: true, reset });

  return {
    MockFs,
    getFiles: () => root.children ?? [],
    getTrash: () => trash,
    clear: () => {
      root = { path: 'root', name: 'root', children: [] };
      textFileContents = {};
      binaryFiles = {};
      trash = [];
      fileStats = {};
      watchCallbacks.clear();
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
    printTree: () => {
      printFileTree(root.children ?? []);
    },
    reset,
    clearTrash: () => {
      trash = [];
    },
    setFiles: (filesToLoad) => {
      const init = initializeMockFsRoot(filesToLoad, matching);
      root = init.root;
      textFileContents = init.textFileContents;
      binaryFiles = init.binaryFiles;
      fileStats = init.fileStats;
    },
    addFiles: (filesToLoad) => {
      const init = initializeMockFsRoot(filesToLoad, matching);

      init.root.children?.forEach((child) => {
        addToFileTree(root, child, matching);
      });

      textFileContents = {
        ...textFileContents,
        ...init.textFileContents,
      };

      binaryFiles = {
        ...binaryFiles,
        ...init.binaryFiles,
      };

      fileStats = {
        ...fileStats,
        ...init.fileStats,
      };
    },
    exists: (path, options) =>
      mockExists(root, resolveMockPath(path, options), matching),
    existsInTrash: (path, options) =>
      !!trash.find(
        (fileEntry) =>
          key(fileEntry.path) === key(resolveMockPath(path, options)),
      ),
    readTextFile: (path, options) => {
      const fullPath = resolveMockPath(path, options);

      // Ensure file entry exists
      mockGetFileEntry(root, fullPath, matching);

      return textFileContents[key(fullPath)] || '';
    },
    readJsonFile: <T = object>(
      path: string,
      options?: FsReadFileOptions & { restoreDates?: boolean },
    ): T => {
      const fullPath = resolveMockPath(path, options);

      // Ensure file entry exists
      mockGetFileEntry(root, fullPath, matching);

      let data = JSON.parse(textFileContents[key(fullPath)]);

      if (options?.restoreDates !== false) {
        data = restoreDates(data);
      }

      return data;
    },
    readYamlFile: async (
      path,
      options: FsReadFileOptions & { restoreDates?: boolean },
    ) => {
      const fullPath = resolveMockPath(path, options);

      // Ensure file entry exists
      mockGetFileEntry(root, fullPath, matching);

      let data = YAML.parse(textFileContents[key(fullPath)]);

      if (options?.restoreDates !== false) {
        data = restoreDates(data);
      }

      return data;
    },
    writeTextFile: (path, textContent, options) => {
      const fullPath = resolveMockPath(path, options);

      if (!mockExists(root, fullPath, matching)) {
        mockAddFileEntry(
          root,
          { path: fullPath, name: fileNameFromPath(fullPath) },
          matching,
        );
      }

      textFileContents[key(fullPath)] = textContent;
    },
    writeJsonFile: (path, textContent, pretty, options) => {
      const fullPath = resolveMockPath(path, options);

      if (!mockExists(root, fullPath, matching)) {
        mockAddFileEntry(
          root,
          { path: fullPath, name: fileNameFromPath(fullPath) },
          matching,
        );
      }

      textFileContents[key(fullPath)] = JSON.stringify(
        textContent,
        null,
        pretty ? 2 : 0,
      );
    },
    writeYamlFile: async (path, values, options) => {
      const fullPath = resolveMockPath(path, options);

      if (!mockExists(root, fullPath, matching)) {
        mockAddFileEntry(
          root,
          { path: fullPath, name: fileNameFromPath(fullPath) },
          matching,
        );
      }

      textFileContents[key(fullPath)] = YAML.stringify(values);
    },
    createDir: (path, options) => {
      MockFs.createDir(path, options);
    },
    removeFile: (path, options) => {
      const fullPath = resolveMockPath(path, options);

      mockRemoveFileEntry(root, fullPath, matching);

      // Remove the file's contents and stats
      clearContents(fullPath);
    },
    removeDir: (path, options) => {
      const fullPath = resolveMockPath(path, options);

      mockRemoveDirEntry(root, fullPath, {
        ...matching,
        recursive: options?.recursive,
      });

      // Remove the contents and stats of the directory's files
      clearContents(fullPath);
    },
    downloadFile: (_, path, options) => {
      const fullPath = resolveMockPath(path, options);

      if (!mockExists(root, fullPath, matching)) {
        mockAddFileEntry(
          root,
          { path: fullPath, name: fileNameFromPath(fullPath) },
          matching,
        );
      }
    },
    setFilePickerResult: (result) => {
      filePickerResult = result;
    },
    setFileStats: (path, stats) => {
      fileStats[key(resolveMockPath(path))] = stats;
    },
    printWatchers: () => {
      console.log('---------- MockFs watchers -----------');
      watchCallbacks.forEach(({ paths }, id) => {
        console.log(`  [${id}] ${paths.join(', ')}`);
      });
      console.log('--------------------------------------');
    },
    dispatchWatchEvent: (kind, eventPaths) => {
      watchCallbacks.forEach(({ paths: watchedPaths, callback }) => {
        const matchingPaths = eventPaths.filter((eventPath) =>
          watchedPaths.some((watchedPath) =>
            isAtOrUnder(key(eventPath), key(watchedPath)),
          ),
        );

        if (matchingPaths.length > 0) {
          callback({ kind, paths: matchingPaths });
        }
      });
    },
  };
}

/**
 * Builds a mock file tree from file descriptors, along with the
 * files' contents and stats.
 *
 * @param fileDescriptors - The files to add, as descriptors or paths.
 * @param matching - The file system's path matching options.
 * @returns The file tree's root, and the files' contents and stats keyed by path.
 */
function initializeMockFsRoot(
  fileDescriptors: (MockFileDescriptor | string)[],
  matching: MockFileSystemOptions,
): {
  root: FsEntry;
  textFileContents: Record<string, string>;
  binaryFiles: Record<string, any>;
  fileStats: Record<string, MockFileStats>;
} {
  const root: FsEntry = { path: 'root', name: 'root', children: [] };
  const textFileContents: Record<string, string> = {};
  const binaryFiles: Record<string, any> = {};
  const fileStats: Record<string, MockFileStats> = {};

  fileDescriptors.forEach((fileDescriptor) => {
    const path =
      typeof fileDescriptor === 'string'
        ? fileDescriptor
        : resolveMockPath(fileDescriptor.path, fileDescriptor.options);
    const pathParts = path.split('/');

    let currentPath = '';

    pathParts.forEach((part) => {
      currentPath = `${currentPath}${part}`;

      if (!mockExists(root, currentPath, matching)) {
        mockAddFileEntry(
          root,
          {
            path: currentPath,
            name: part,
            children:
              part.includes('.') && !part.startsWith('.') ? undefined : [],
          },
          matching,
        );
      }

      currentPath = `${currentPath}/`;
    });

    // Resolve the path's key. A later descriptor for the same file
    // replaces an earlier one's contents.
    const key = resolveMockPathKey(path, matching);

    if (typeof fileDescriptor !== 'string') {
      if (fileDescriptor.textContent !== undefined) {
        textFileContents[key] = fileDescriptor.textContent;
      }

      if (fileDescriptor.binaryFile) {
        binaryFiles[key] = fileDescriptor.binaryFile;
      }

      if (fileDescriptor.stats) {
        fileStats[key] = fileDescriptor.stats;
      }
    }
  });

  return { root, textFileContents, binaryFiles, fileStats };
}

/**
 * Adds a file tree entry to a mock file tree. Merges a directory's
 * children into the directory already at its path.
 *
 * @param root - The root of the file tree to add to.
 * @param file - The entry to add.
 * @param matching - The file system's path matching options.
 */
function addToFileTree(
  root: FsEntry,
  file: FsEntry,
  matching: MockFileSystemOptions,
): void {
  if (!mockExists(root, file.path, matching)) {
    // Add the entry if its path is free
    mockAddFileEntry(root, file, matching);
  } else if (file.children) {
    // Otherwise, add a directory's children to the existing directory
    file.children.forEach((child) => addToFileTree(root, child, matching));
  }
}
