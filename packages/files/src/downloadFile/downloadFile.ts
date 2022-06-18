import { Core } from '@minddrop/core';
import { FileReference } from '../types';
import { downloadFileToStorage } from '../file-storage';

/**
 * Downloads a file and creates a new file reference.
 * Dispatches a `files:file:save` event.
 *
 * Returns the file reference.
 *
 * @param core - A MindDrop core instance.
 * @param url - The file URL.
 * @returns A file reference.
 */
export async function downloadFile(
  core: Core,
  url: string,
): Promise<FileReference> {
  // Download the file to the persistent file storage
  const fileReference = await downloadFileToStorage(core, url);

  // Dispatch a 'files:file:save' event
  core.dispatch('files:file:save', fileReference);

  return fileReference;
}
