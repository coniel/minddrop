import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { FieldValue } from '@minddrop/utils';
import { RichTextElement } from '../types';
import { updateRichTextElement } from '../updateRichTextElement';

/**
 * Removes files from an element and dispatches a
 * `rich-text-elements:remove-files` event. Returns the updated
 * element.
 *
 * Removes the element as a parent from the file references.
 *
 * - Throws a `RichTextElementNotFoundError` if the element does not exist.
 * - Throws a `FileReferenceNotFoundError` if any of the file references do not exist.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element from which to remove the files.
 * @param fileIds The IDs of the files to remove.
 * @returns The updated element.
 */
export function removeFilesFromRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string, fileIds: string[]): TElement {
  // Remove the file IDs from the element
  const element = updateRichTextElement<TElement>(core, elementId, {
    files: FieldValue.arrayRemove(fileIds),
  });

  // Remove the element as a parent from the files
  fileIds.forEach((id) => {
    Files.removeAttachments(core, id, [elementId]);
  });

  // Get the updated file references
  const files = Files.get(fileIds);

  // Dispatch a 'rich-text-elements:remove-files' event
  core.dispatch('rich-text-elements:remove-files', { element, files });

  // Return the updated element
  return element;
}
