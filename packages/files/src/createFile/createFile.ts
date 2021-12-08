import { Core } from '@minddrop/core';
import { generateFileReference } from '../generateFileReference';
import { FileReference } from '../types';

/**
 * Creates a new file reference and dispatches a `files:create` event.
 * Returns a promise which resolves to the newly created file reference.
 *
 * @param core A MindDrop core instance.
 * @param data The file property values.
 * @returns A promise which resolves to the newly created file reference.
 */
export async function createFile(
  core: Core,
  file: File,
): Promise<FileReference> {
  const reference = await generateFileReference(file);

  core.dispatch('files:create', { file, reference });

  return reference;
}
