import { Fs } from '@minddrop/core';

/**
 * Adds a numerix suffix to the given file path if the file
 * path already exists.
 */
export async function incrementalPath(
  path: string,
  increment?: number,
): Promise<string> {
  const filename = path.split('/').slice(-1)[0];
  const extension = filename.includes('.')
    ? `.${filename.split('.').slice(-1)[0]}`
    : '';
  const pathWithoutExtension = path.slice(0, path.length - extension.length);

  // Create the incremented file name by adding the increment
  // suffix in between the filename and file extension.
  let incrementedPath = increment
    ? `${pathWithoutExtension} ${increment}${extension}`
    : path;

  // Cap increment to 200 to prevent accidental infinite loops
  if (increment && increment > 200) {
    throw new Error(
      `reached maximum file increment of 200: ${incrementedPath}`,
    );
  }

  const exists = await Fs.exists(incrementedPath);

  // If the path exists, recursively increment the suffix
  // until reaching a unique path.
  if (exists) {
    incrementedPath = await incrementalPath(
      path,
      increment ? increment + 1 : 1,
    );
  }

  return incrementedPath;
}
