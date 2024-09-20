import { fileNameFromPath } from '../fileNameFromPath';
import { FileSystemAdapter } from '../types';

export interface IncrementedPath {
  path: string;
  name: string;
  increment?: number;
}

/**
 * Adds a numerix suffix to the given file path if the file
 * path already exists.
 *
 * @param Fs - File system adapter.
 * @param targetPath - The path to check.
 * @param currentIncrement - The starting increment (used internally for recursive calls).
 * @returns The incremented path and increment number if incremeneted.
 */
export async function incrementalPath(
  Fs: FileSystemAdapter,
  targetPath: string,
  currentIncrement?: number,
): Promise<IncrementedPath> {
  let incrementedPath: IncrementedPath = {
    path: targetPath,
    name: fileNameFromPath(targetPath),
    increment: currentIncrement,
  };

  // Get the last segment of the path as the file name
  const filename = targetPath.split('/').slice(-1)[0];
  // Get file extension
  const extension = filename.includes('.')
    ? `.${filename.split('.').slice(-1)[0]}`
    : '';
  // Remove file extension from path
  const pathWithoutExtension = targetPath.slice(
    0,
    targetPath.length - extension.length,
  );

  // Create the incremented file name
  incrementedPath.path = currentIncrement
    ? `${pathWithoutExtension} ${currentIncrement}${extension}`
    : targetPath;

  // Update file name
  incrementedPath.name = fileNameFromPath(incrementedPath.path);

  // Cap increment to 200 to prevent accidental infinite loops
  if (currentIncrement && currentIncrement > 200) {
    throw new Error(
      `reached maximum file increment of 200: ${incrementedPath.path}`,
    );
  }

  // Check if the path exists
  const exists = await Fs.exists(incrementedPath.path);

  // If the path exists, recursively increment the suffix
  // until reaching a unique path.
  if (exists) {
    // Recursively get incremetal path until reaching a unique one
    incrementedPath = await incrementalPath(
      Fs,
      targetPath,
      currentIncrement ? currentIncrement + 1 : 1,
    );
  }

  return incrementedPath;
}
