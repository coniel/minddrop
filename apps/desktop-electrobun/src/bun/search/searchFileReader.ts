import { Utils } from 'electrobun/bun';
import fsp from 'node:fs/promises';
import path from 'path';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import type { Database, DatabaseEntry } from '@minddrop/databases';
import { registerFileSystemAdapter } from '@minddrop/file-system';
import type { FileSystemAdapter, FsEntry } from '@minddrop/file-system';

/**
 * Returns the path to the workspaces config file.
 */
function getWorkspacesConfigPath(): string {
  return `${Utils.paths.config}/MindDrop/workspaces.json`;
}

/**
 * Reads the workspace paths from the workspaces config file.
 */
export async function readWorkspacePaths(): Promise<string[]> {
  try {
    const raw = await Bun.file(getWorkspacesConfigPath()).text();
    const config = JSON.parse(raw) as { paths: string[] };

    return config.paths;
  } catch {
    console.warn('[search] Could not read workspaces config');

    return [];
  }
}

/**
 * Reads the workspace ID from its config file.
 */
export async function readWorkspaceId(
  workspacePath: string,
): Promise<string | null> {
  try {
    const configPath = path.join(workspacePath, '.minddrop', 'workspace.json');
    const raw = await Bun.file(configPath).text();
    const config = JSON.parse(raw) as { id: string };

    return config.id;
  } catch {
    console.warn(
      `[search] Could not read workspace config at ${workspacePath}`,
    );

    return null;
  }
}

/**
 * Reads all database configs from a workspace using the
 * databases package.
 */
export async function readDatabaseConfigs(
  workspacePath: string,
): Promise<Database[]> {
  return Databases.readWorkspaceDatabases(workspacePath);
}

/**
 * Reads all entries from a database using the databases package.
 */
export async function readDatabaseEntries(
  database: Database,
): Promise<DatabaseEntry[]> {
  return DatabaseEntries.readFiles(database);
}

/**
 * Registers a minimal file system adapter backed by native Bun/Node
 * file I/O. Only implements the methods needed for reading databases
 * and entries.
 */
export function registerBunFileSystemAdapter(): void {
  registerFileSystemAdapter({
    readDir: async (dirPath, options) =>
      readDirAsEntries(dirPath, options?.recursive),
    readTextFile: async (filePath) => Bun.file(filePath).text(),
    getBaseDirPath: async () => '',
    convertFileSrc: (filePath) => filePath,
    exists: async (filePath) => {
      try {
        await fsp.stat(filePath);

        return true;
      } catch {
        return false;
      }
    },
    // Stub out methods not needed for reading
    isDirectory: async () => false,
    copyFile: async () => {},
    createDir: async () => {},
    removeDir: async () => {},
    removeFile: async () => {},
    trashDir: async () => {},
    trashFile: async () => {},
    rename: async () => {},
    writeBinaryFile: async () => {},
    writeTextFile: async () => {},
    downloadFile: async () => {},
    openFilePicker: async () => null,
    watch: async () => '',
    unwatch: async () => {},
  } as FileSystemAdapter);
}

/**
 * Reads directory entries in the FsEntry format expected by
 * the file system abstraction.
 */
async function readDirAsEntries(
  dirPath: string,
  recursive = false,
): Promise<FsEntry[]> {
  const entries = await fsp.readdir(dirPath, { withFileTypes: true });

  return Promise.all(
    entries
      .filter(
        (entry) => !entry.name.startsWith('.') || entry.name === '.minddrop',
      )
      .map(async (entry): Promise<FsEntry> => {
        const fullPath = path.join(dirPath, entry.name);
        const fsEntry: FsEntry = { name: entry.name, path: fullPath };

        if (entry.isDirectory()) {
          fsEntry.children = recursive
            ? await readDirAsEntries(fullPath, recursive)
            : [];
        }

        return fsEntry;
      }),
  );
}
