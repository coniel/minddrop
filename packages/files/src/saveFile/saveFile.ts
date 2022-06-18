import { Core } from '@minddrop/core';
import { FileReference } from '../types';
import { saveFileToStorage } from '../file-storage';

/**
 * Saves a file and creates a new file reference.
 * Dispatches a `files:file:save` event.
 *
 * Returns a new file reference.
 *
 * @param core - A MindDrop core instance.
 * @param file - A file object.
 * @returns A file reference.
 */
export async function saveFile(core: Core, file: File): Promise<FileReference> {
  // Save the file to the persistent file storage
  const fileReference = await saveFileToStorage(core, file);

  // Dispatch a 'files:file:save' event
  core.dispatch('files:file:save', fileReference);

  return fileReference;
}
