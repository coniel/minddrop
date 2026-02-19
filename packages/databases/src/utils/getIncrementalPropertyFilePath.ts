import { Fs } from '@minddrop/file-system';
import { IncrementedPath } from '@minddrop/file-system';
import { getPropertyFilePath } from './getPropertyFilePath';

/**
 * Returns the path to an entry property's file, incrementing the file name
 * if a file with the same name already exists in the entry's directory.
 *
 * @param entryId - The ID of the entry.
 * @param propertyName - The name of the property.
 * @param fileName - The name of the file, i.e. the value of the property.
 * @returns The path to the property file.
 */
export async function getIncrmentalPropertyFilePath(
  entryId: string,
  propertyName: string,
  fileName: string,
): Promise<IncrementedPath> {
  return Fs.incrementalPath(
    getPropertyFilePath(entryId, propertyName, fileName),
  );
}
