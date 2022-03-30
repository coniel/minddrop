import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { addFilesToRichTextElement } from '../addFilesToRichTextElement';
import { getRichTextElement } from '../getRichTextElement';
import { removeFilesFromRichTextElement } from '../removeFilesFromRichTextElement';
import { RichTextElement } from '../types';

/**
 * Replaces the files in a rich text element by removing its
 * current files and adding the provided ones. Dispatches a
 * `rich-text-elements:replace-files` event and returns the
 * updated element.
 *
 * The element will be added as a parent onto the added files, and removed as a parent from the removed files.
 *
 * - Throws a `RichTextElementNotFoundError` if the element does not exist.
 * - Throws a `FileReferenceNotFoundError` if any of the file references do not exist.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element in which to replace the files.
 * @param fileIds The IDs of the files to add to the element.
 * @returns The updated element.
 */
export function replaceFilesInRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string, fileIds: string[]): TElement {
  // Get the IDs of the files to remove
  const { files: removedFileIds } = getRichTextElement(elementId);

  if (removedFileIds) {
    // Remove the current files from the element
    removeFilesFromRichTextElement(core, elementId, removedFileIds);
  }

  // Add the new files to the element
  const element = addFilesToRichTextElement<TElement>(core, elementId, fileIds);

  // Get the updated removed file references
  const removedFiles = Files.get(removedFileIds || []);
  // Get the updated added file references
  const addedFiles = Files.get(fileIds);

  // Dispatch a 'rich-text-elements:replace-files' event
  core.dispatch('rich-text-elements:replace-files', {
    element,
    removedFiles,
    addedFiles,
  });

  // Return the updated element
  return element;
}
