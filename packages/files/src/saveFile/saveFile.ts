import { Core } from '@minddrop/core';
import { FileReference } from '../types';
import { FileReferencesResource } from '../FileReferencesResource';

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
export function saveFile(core: Core, file: File): FileReference {
  // Create a file reference
  const fileReference = FileReferencesResource.create(core, {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  // Dispatch a 'files:file:save' event
  core.dispatch('files:file:save', { file, fileReference });

  return fileReference;
}
