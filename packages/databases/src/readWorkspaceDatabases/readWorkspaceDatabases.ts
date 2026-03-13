import { Fs, FsEntry } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { DatabaseConfigFileName } from '../constants';
import { Database } from '../types';

/**
 * Reads all database configs from a workspace directory by
 * scanning for .minddrop/database.json files recursively.
 *
 * @param workspacePath - The absolute path to the workspace directory.
 * @returns The database configs found in the workspace.
 */
export async function readWorkspaceDatabases(
  workspacePath: string,
): Promise<Database[]> {
  // Read all files in the workspace recursively
  const workspaceFiles = await Fs.readDir(workspacePath, { recursive: true });

  // Find paths to database.json config files
  const databasePaths = findDatabasePaths(workspaceFiles);

  // Read and parse each database config
  const configs = await Promise.all(databasePaths.map(readDatabaseConfig));

  return configs.filter((config): config is Database => config !== null);
}

/**
 * Finds all database config file paths in a set of directory entries.
 *
 * @param entries - The directory entries to search in.
 * @param inHiddenDir - Whether the current entries are inside a .minddrop directory.
 * @returns The paths to all database.json config files.
 */
function findDatabasePaths(entries: FsEntry[], inHiddenDir = false): string[] {
  return entries.flatMap((entry) => {
    const name = entry.path.split('/').pop();
    const isMinddropDir = name === Paths.hiddenDirName;

    if (entry.children) {
      return findDatabasePaths(entry.children, inHiddenDir || isMinddropDir);
    }

    return inHiddenDir && name === DatabaseConfigFileName ? [entry.path] : [];
  });
}

/**
 * Reads a single database config from a database.json file path.
 *
 * @param path - The path to the database.json file.
 * @returns The database config, or null if reading fails.
 */
async function readDatabaseConfig(
  configPath: string,
): Promise<Database | null> {
  try {
    const config = await Fs.readJsonFile<Database>(configPath);

    // The database directory path (strip .minddrop/database.json)
    const databasePath = configPath.split('/').slice(0, -2).join('/');

    // Derive ID and name from the directory name
    const dirName = Fs.fileNameFromPath(databasePath);

    return {
      ...config,
      id: dirName,
      name: dirName,
      path: databasePath,
    };
  } catch {
    return null;
  }
}
