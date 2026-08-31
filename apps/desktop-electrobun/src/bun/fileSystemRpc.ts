import { Utils } from 'electrobun/bun';
import { type FSWatcher, watch as fsWatch } from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'path';
import { BaseDirectory } from '@minddrop/file-system';
import type { FsWatchEventKind } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';

/**
 * Returns the absolute path of a base directory.
 *
 * @param dir - The base directory to resolve.
 * @returns The base directory's absolute path.
 */
function getBaseDirPath(dir: BaseDirectory): string {
  // Map each supported base directory to its absolute path
  switch (dir) {
    case BaseDirectory.AppData:
      return `${Utils.paths.appData}/MindDrop`;
    case BaseDirectory.AppConfig:
      return `${Utils.paths.config}/MindDrop`;
    case BaseDirectory.Documents:
      return Utils.paths.documents;
    default:
      throw new InvalidParameterError(`Invalid BaseDirectory value: ${dir}`);
  }
}

/**
 * Resolves a path against an optional base directory.
 *
 * @param filePath - The path to resolve.
 * @param baseDir - The base directory to resolve against.
 * @returns The resolved path.
 */
function resolvePath(filePath: string, baseDir?: BaseDirectory): string {
  // Without a base directory the path is used as is
  if (!baseDir) {
    return filePath;
  }

  // Join the path onto the base directory's path
  return path.join(getBaseDirPath(baseDir), filePath);
}

/**
 * Checks whether a directory entry name is visible or the workspace
 * config directory.
 *
 * @param name - The entry name to check.
 * @returns Whether the entry should be included in listings.
 */
function isNonHiddenFileOrWorkspaceConfig(name: string): boolean {
  return !name.startsWith('.') || name === '.minddrop';
}

interface FsEntry {
  name: string;
  path: string;
  children?: FsEntry[];
}

/**
 * Reads a directory's contents as file system entries.
 *
 * @param dirPath - The absolute path of the directory to read.
 * @param recursive - Whether to read subdirectories' contents.
 * @returns The directory's entries.
 */
async function readDirAsEntries(
  dirPath: string,
  recursive = false,
): Promise<FsEntry[]> {
  // Read the directory's contents
  const entries = await fsp.readdir(dirPath, { withFileTypes: true });

  // Map visible entries to FsEntry objects in parallel
  return Promise.all(
    entries
      // Drop hidden entries except the workspace config directory
      .filter((entry) => isNonHiddenFileOrWorkspaceConfig(entry.name))
      .map(async (entry): Promise<FsEntry> => {
        // Build the entry with its full path
        const fullPath = path.join(dirPath, entry.name);
        const fsEntry: FsEntry = { name: entry.name, path: fullPath };

        // Directories get a children list, read recursively if requested
        if (entry.isDirectory()) {
          fsEntry.children = recursive
            ? await readDirAsEntries(fullPath, recursive)
            : [];
        }

        return fsEntry;
      }),
  );
}

// Active watchers keyed by watch subscription ID
const watchers = new Map<string, FSWatcher[]>();
let nextWatcherId = 0;

// The callback used to send watch events to the webview, set once
// the RPC channel is available
let sendWatchEvent:
  | ((event: { id: string; kind: FsWatchEventKind; paths: string[] }) => void)
  | null = null;

/**
 * Sets the callback used to send file system watch events to the
 * webview.
 *
 * @param sender - The callback to send watch events with.
 */
export function setWatchEventSender(
  sender: (event: {
    id: string;
    kind: FsWatchEventKind;
    paths: string[];
  }) => void,
) {
  // Store the sender for watchers to use
  sendWatchEvent = sender;
}

/**
 * Maps a node fs watch event type to a watch event kind.
 *
 * @param eventType - The node fs event type.
 * @returns The corresponding watch event kind.
 */
function mapFsEventKind(eventType: string): FsWatchEventKind {
  // Map each node event type to its watch event kind
  switch (eventType) {
    case 'rename':
      return 'any';
    case 'change':
      return 'modify';
    default:
      return 'any';
  }
}

/**
 * RPC handlers implementing the file system adapter for the webview.
 */
export const fileSystemRpcHandlers = {
  // Returns the absolute path of a base directory
  fsGetBaseDirPath: async ({
    dir,
  }: {
    dir: BaseDirectory;
  }): Promise<string> => {
    return getBaseDirPath(dir);
  },

  // Checks whether a path points to a directory
  fsIsDirectory: async ({
    path: filePath,
    baseDir,
  }: {
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<boolean> => {
    // Resolve the path against the base directory
    const resolved = resolvePath(filePath, baseDir);

    try {
      // Stat the path to inspect its type
      const stat = await fsp.stat(resolved);

      return stat.isDirectory();
    } catch {
      // Missing paths are not directories
      return false;
    }
  },

  // Copies a file to a new location
  fsCopyFile: async ({
    source,
    destination,
    fromPathBaseDir,
    toPathBaseDir,
  }: {
    source: string;
    destination: string;
    fromPathBaseDir?: BaseDirectory;
    toPathBaseDir?: BaseDirectory;
  }): Promise<void> => {
    // Resolve the source and destination paths
    const input = Bun.file(resolvePath(source, fromPathBaseDir));
    const output = Bun.file(resolvePath(destination, toPathBaseDir));

    // Write the source file's contents to the destination
    await Bun.write(output, input);
  },

  // Creates a directory
  fsCreateDir: async ({
    path: dirPath,
    baseDir,
    recursive,
  }: {
    path: string;
    baseDir?: BaseDirectory;
    recursive?: boolean;
  }): Promise<void> => {
    // Resolve the path against the base directory
    const resolved = resolvePath(dirPath, baseDir);

    // Create the directory, including parents if requested
    await fsp.mkdir(resolved, { recursive: recursive ?? false });
  },

  // Checks whether a path exists
  fsExists: async ({
    path: filePath,
    baseDir,
  }: {
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<boolean> => {
    try {
      // Stat the path, which throws if it does not exist
      await fsp.stat(resolvePath(filePath, baseDir));

      return true;
    } catch {
      return false;
    }
  },

  // Reads a directory's contents as file system entries
  fsReadDir: async ({
    path: dirPath,
    baseDir,
    recursive,
  }: {
    path: string;
    baseDir?: BaseDirectory;
    recursive?: boolean;
  }): Promise<FsEntry[]> =>
    readDirAsEntries(resolvePath(dirPath, baseDir), recursive),

  // Reads a text file's contents
  fsReadTextFile: async ({
    path: filePath,
    baseDir,
  }: {
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<string> => Bun.file(resolvePath(filePath, baseDir)).text(),

  // Reads multiple text files, returning the ones that could be read
  fsReadTextFiles: async ({
    paths,
    baseDir,
  }: {
    paths: string[];
    baseDir?: BaseDirectory;
  }): Promise<[string, string][]> => {
    // Read all files in parallel, collecting results as entries
    const results = await Promise.allSettled(
      paths.map(async (filePath) => {
        // Read the file's contents
        const content = await Bun.file(resolvePath(filePath, baseDir)).text();

        return [filePath, content] as [string, string];
      }),
    );

    // Return only successful reads (partial success)
    return results
      .filter(
        (result): result is PromiseFulfilledResult<[string, string]> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);
  },

  // Removes a directory
  fsRemoveDir: async ({
    path: dirPath,
    baseDir,
    recursive,
  }: {
    path: string;
    baseDir?: BaseDirectory;
    recursive?: boolean;
  }): Promise<void> => {
    // Resolve the path against the base directory
    const resolved = resolvePath(dirPath, baseDir);

    // Remove the directory, including contents if requested
    await fsp.rm(resolved, { recursive: recursive ?? false, force: true });
  },

  // Removes a file
  fsRemoveFile: async ({
    path: filePath,
    baseDir,
  }: {
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<void> => Bun.file(resolvePath(filePath, baseDir)).delete(),

  // Renames or moves a file or directory
  fsRename: async ({
    oldPath,
    newPath,
    oldPathBaseDir,
    newPathBaseDir,
  }: {
    oldPath: string;
    newPath: string;
    oldPathBaseDir?: BaseDirectory;
    newPathBaseDir?: BaseDirectory;
  }): Promise<void> => {
    // Resolve both paths against their base directories
    const resolvedOld = resolvePath(oldPath, oldPathBaseDir);
    const resolvedNew = resolvePath(newPath, newPathBaseDir);

    // Rename the file or directory
    await fsp.rename(resolvedOld, resolvedNew);
  },

  // Moves a directory to the system trash
  fsTrashDir: async ({ path: dirPath }: { path: string }): Promise<void> => {
    Utils.moveToTrash(dirPath);
  },

  // Moves a file to the system trash
  fsTrashFile: async ({ path: filePath }: { path: string }): Promise<void> => {
    Utils.moveToTrash(filePath);
  },

  // Writes binary contents to a file
  fsWriteBinaryFile: async ({
    path: filePath,
    file,
    baseDir,
  }: {
    path: string;
    file: Blob;
    baseDir?: BaseDirectory;
  }): Promise<void> => {
    await Bun.write(resolvePath(filePath, baseDir), file);
  },

  // Writes text contents to a file
  fsWriteTextFile: async ({
    path: filePath,
    contents,
    baseDir,
  }: {
    path: string;
    contents: string;
    baseDir?: BaseDirectory;
  }): Promise<void> => {
    await Bun.write(resolvePath(filePath, baseDir), contents);
  },

  // Writes multiple text files
  fsWriteTextFiles: async ({
    entries,
    baseDir,
  }: {
    entries: { path: string; contents: string }[];
    baseDir?: BaseDirectory;
  }): Promise<void> => {
    // Write all files in parallel
    await Promise.all(
      entries.map((entry) =>
        Bun.write(resolvePath(entry.path, baseDir), entry.contents),
      ),
    );
  },

  // Downloads a file from a URL to the given path
  fsDownloadFile: async ({
    url,
    path: filePath,
    baseDir,
  }: {
    url: string;
    path: string;
    baseDir?: BaseDirectory;
  }): Promise<void> => {
    // Resolve the destination path
    const resolved = resolvePath(filePath, baseDir);

    // Fetch the file from the URL
    const response = await fetch(url, {
      headers: { 'User-Agent': 'MindDrop/1.0' },
    });

    // Fail on unsuccessful responses
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    // Stream the response body to the destination file
    await Bun.write(resolved, response);
  },

  // Starts watching paths for file system changes
  fsWatch: async ({
    paths: watchPaths,
    recursive,
    baseDir,
  }: {
    paths: string[];
    recursive?: boolean;
    baseDir?: BaseDirectory;
  }): Promise<string> => {
    // Assign the subscription a unique ID
    const id = String(nextWatcherId++);
    const pathWatchers: FSWatcher[] = [];

    // Start a watcher for each requested path
    for (const watchPath of watchPaths) {
      // Resolve the path against the base directory
      const resolved = resolvePath(watchPath, baseDir);

      // Watch the path, forwarding events to the webview
      const watcher = fsWatch(
        resolved,
        { recursive: recursive ?? false },
        (eventType, filename) => {
          // Drop events until the sender has been set
          if (!sendWatchEvent) {
            return;
          }

          // Map the node event to a watch event kind and path
          const kind = mapFsEventKind(eventType);
          const eventPath = filename ? path.join(resolved, filename) : resolved;

          // Send the event to the webview
          sendWatchEvent({ id, kind, paths: [eventPath] });
        },
      );

      pathWatchers.push(watcher);
    }

    // Register the watchers under the subscription ID
    watchers.set(id, pathWatchers);

    return id;
  },

  // Stops a watch subscription
  fsUnwatch: async ({ id }: { id: string }): Promise<void> => {
    // Look up the subscription's watchers
    const pathWatchers = watchers.get(id);

    if (pathWatchers) {
      // Close each of the subscription's watchers
      for (const watcher of pathWatchers) {
        watcher.close();
      }

      // Remove the subscription
      watchers.delete(id);
    }
  },

  // Returns a file's creation and modification times
  fsStat: async ({
    path: filePath,
  }: {
    path: string;
  }): Promise<{ created: string; lastModified: string }> => {
    // Stat the file for its timestamps
    const stat = await fsp.stat(filePath);

    // Serialize the dates explicitly, as they cross the RPC as strings
    return {
      created: stat.birthtime.toISOString(),
      lastModified: stat.mtime.toISOString(),
    };
  },

  // Opens a native file picker dialog
  fsOpenFilePicker: async ({
    directory,
    multiple,
    accept,
  }: {
    directory?: boolean;
    multiple?: boolean;
    accept?: string[];
  }): Promise<string | string[] | null> => {
    // Map accept file types to Electrobun's allowedFileTypes format
    const allowedFileTypes = accept?.length ? accept.join(',') : '*';

    // Open the native file dialog
    const chosenPaths = await Utils.openFileDialog({
      startingFolder: Utils.paths.documents,
      allowedFileTypes,
      canChooseFiles: !directory,
      canChooseDirectory: directory ?? false,
      allowsMultipleSelection: multiple ?? false,
    });

    // Cancelled dialogs can report an empty string path
    const selectedPaths = (chosenPaths ?? []).filter(Boolean);

    // Return null if no files were selected
    if (selectedPaths.length === 0) {
      return null;
    }

    // Return a single path or array based on the multiple option
    if (multiple) {
      return selectedPaths;
    }

    return selectedPaths[0];
  },
};
