import { FsEntry, Fs } from '@minddrop/file-system';

/**
 * Recursively reads the contents of a directory and returns
 * the files as a flattened array.
 *
 * @param path - The base dir path for which to read the files.
 * @returns A flattened list of file entries.
 */
export async function getDirFilesRecursiveFlat(
  path: string,
): Promise<FsEntry[]> {
  // Get all files from dir recursively
  const fileEntries = await Fs.readDir(path, { recursive: true });

  return flatten(fileEntries);
}

function flatten(fileEntries: FsEntry[]): FsEntry[] {
  return fileEntries.reduce<FsEntry[]>((flattened, fileEntry) => {
    return fileEntry.children
      ? flattened.concat(flatten(fileEntry.children))
      : flattened.concat([fileEntry]);
  }, []);
}
