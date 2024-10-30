import { Fs } from '@minddrop/file-system';
import { WorkspaceCacheDirName, WorkspaceConfigDirName } from '../constants';

/**
 * Downloads a file to the workspace cache. The file is stored
 * in a subderectory named after the resource ID.
 *
 * @param workspacePath - The path to the workspace.
 * @param resourceId - The ID of the resource to which the file belongs.
 * @param fileName - The name of the cahced file.
 * @param url - The URL to download.
 * @returns The path to the downloaded file.
 */
export async function downloadToCache(
  workspacePath: string,
  resourceId: string,
  fileName: string,
  url: string,
): Promise<string> {
  const cacheDir = Fs.concatPath(
    workspacePath,
    WorkspaceConfigDirName,
    WorkspaceCacheDirName,
  );
  const resourceDir = Fs.concatPath(cacheDir, resourceId);
  const filePath = Fs.concatPath(resourceDir, fileName);

  // Create cache directory if it does not exist
  if (!(await Fs.exists(cacheDir))) {
    await Fs.createDir(cacheDir);
  }

  // Create resource directory if it does not exist
  if (!(await Fs.exists(resourceDir))) {
    await Fs.createDir(resourceDir);
  }

  // Download the file
  await Fs.downloadFile(url, filePath);

  return filePath;
}
