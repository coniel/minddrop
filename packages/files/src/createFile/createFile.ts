import { Core } from '@minddrop/core';
import { generateFileReference } from '../generateFileReference';
import { FileReference } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Creates a new file reference and dispatches a `files:create` event.
 * Returns a promise which resolves to the newly created file reference.
 *
 * @param core A MindDrop core instance.
 * @param file A file object.
 * @param attachedTo The IDs of the resources to which this file is attached.
 * @returns A promise which resolves to the newly created file reference.
 */
export async function createFile(
  core: Core,
  file: File,
  attachedTo?: string[],
): Promise<FileReference> {
  const reference = await generateFileReference(file, attachedTo);

  // Add file reference to store
  useFileReferencesStore.getState().setFileReference(reference);

  // Dispatch 'files:create' event
  core.dispatch('files:create', { file, reference });

  return reference;
}
