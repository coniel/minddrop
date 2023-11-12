import { FileEntry, Fs } from '@minddrop/core';

/**
 * Recursively reads the contents of a directory and returns
 * the files as a flattened array.
 *
 * @param path - The base dir path for which to read the files.
 * @returns A flattened list of file entries.
 */
export async function getDirFilesRecursiveFlat(
  path: string,
): Promise<FileEntry[]> {
  // Get all files from dir recursively
  const fileEntries = await Fs.readDir(path, { recursive: true });

  // Flatten file entries into a list of all files
  return flatten(fileEntries);
}

function flatten(children: FileEntry[]) {
  const flat: FileEntry[] = [];

  children.forEach((child) => {
    if (child.children) {
      return flat.push(...flatten(child.children));
    }

    flat.push(child);
  });

  return flat;
}
