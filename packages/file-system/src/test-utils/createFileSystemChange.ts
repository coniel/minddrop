import { FileSystemChange, FileSystemChangeKind } from '../types';

/**
 * Creates a file system change for a path.
 *
 * @param path - The changed path.
 * @param kind - The kind of change.
 * @param workspaceId - The ID of the workspace the change is in.
 * @returns The file system change.
 */
export function createFileSystemChange(
  path: string,
  kind: FileSystemChangeKind,
  workspaceId: string,
): FileSystemChange {
  return { workspaceId, path, kind };
}
