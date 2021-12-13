import { generateId } from '@minddrop/utils';
import { FileReference } from '../types';
import { getImageDimensions } from '../getImageDimensions';

/**
 * Generates a new file reference for a given file.
 *
 * @param file The file for which to create a reference.
 * @returns A new file.
 */
export async function generateFileReference(
  file: File,
): Promise<FileReference> {
  const reference: FileReference = {
    id: generateId(),
    name: file.name,
    size: file.size,
    type: file.type,
  };

  if (file.type.startsWith('image')) {
    const dimensions = await getImageDimensions(file);
    reference.dimensions = dimensions;
  }

  return reference;
}
