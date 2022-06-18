import { Core } from '@minddrop/core';
import { InvalidParameterError } from '@minddrop/utils';
import { FileReference } from '../types';
import { FileReferencesResource } from '../FileReferencesResource';
import { getImageDimensions } from '../getImageDimensions';

/**
 * Creates a new file reference for a given.
 * Dispatches a `files:file-reference:create` event.
 *
 * Returns the new file reference.
 *
 * @param core - A MindDrop core instance.
 * @param file - The file from which to create the reference.
 * @returns A file reference.
 *
 * @throws InvalidParameterError
 * Thrown if the file is not a valid file.
 */
export async function createFileReference(
  core: Core,
  file: File,
): Promise<FileReference> {
  // Validate the file
  if (!(file instanceof File)) {
    throw new InvalidParameterError('file must be a File');
  }

  // Create the file reference
  let fileReference = FileReferencesResource.create(core, {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  if (file.type.includes('image/')) {
    // If the file is an image, get its dimensions
    const dimensions = await getImageDimensions(file);

    // Update the file reference, adding the dimensions
    fileReference = FileReferencesResource.update(core, fileReference.id, {
      dimensions,
    });
  }

  return fileReference;
}
