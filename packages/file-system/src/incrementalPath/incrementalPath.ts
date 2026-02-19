import { fileNameFromPath } from '../fileNameFromPath';
import { getFileExtension } from '../getFileExtension';
import { parentDirPath } from '../parentDirPath';
import { removeFileExtension } from '../removeFileExtension';
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
 * @param ignoreFileExtension - Whether to ignore the file extension when looking for existing files.
 * @returns The incremented path and increment number if incremeneted.
 */
export async function incrementalPath(
  Fs: FileSystemAdapter,
  targetPath: string,
  ignoreFileExtension = false,
): Promise<IncrementedPath> {
  const parentDir = parentDirPath(targetPath);
  const targetFileName = fileNameFromPath(targetPath);
  const incrementedPath: IncrementedPath = {
    path: targetPath,
    name: targetFileName,
  };

  // Get the list of files in the parent directory
  const filesInDir = await Fs.readDir(parentDir);

  // Generate a list of file names in the directory,
  // removing file extensions if specified.
  const fileNamesInDir = filesInDir.map((fileEntry) =>
    ignoreFileExtension
      ? removeFileExtension(fileEntry.name || '')
      : fileEntry.name,
  );

  // While a conflicting file exists, increment the suffix
  let conflictExists = true;
  let increment = 0;
  const fileNameWithoutExtension = removeFileExtension(targetFileName);
  const fileExtension = getFileExtension(targetFileName);
  let fileName = ignoreFileExtension
    ? fileNameWithoutExtension
    : targetFileName;

  while (conflictExists) {
    // Check if a conflicting file exists
    conflictExists = fileNamesInDir.includes(fileName);

    if (conflictExists) {
      // Increment the suffix
      increment += 1;
      // Create the new file name
      fileName = setPathIncrement(
        targetFileName,
        increment,
        ignoreFileExtension,
      );
    }
  }

  // Add the extension back if it was ignored
  if (ignoreFileExtension && fileExtension) {
    fileName = `${fileName}.${fileExtension}`;
  }

  // Set the incremented path details
  if (increment > 0) {
    incrementedPath.path = `${parentDir}/${fileName}`;
    incrementedPath.name = fileName;
    incrementedPath.increment = increment;
  }

  return incrementedPath;
}

export function setPathIncrement(
  path: string,
  increment: number,
  removeExtension = false,
): string {
  const fileNameWithoutExtension = removeFileExtension(path);
  const fileExtension = getFileExtension(path);

  return removeExtension || !fileExtension
    ? `${fileNameWithoutExtension} ${increment}`
    : `${fileNameWithoutExtension} ${increment}.${fileExtension}`;
}
