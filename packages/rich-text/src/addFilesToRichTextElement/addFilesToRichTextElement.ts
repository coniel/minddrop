import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { FieldValue } from '@minddrop/utils';
import { RichTextElement } from '../types';
import { updateRichTextElement } from '../updateRichTextElement';

/**
 * Adds fils to a rich text element and dispatches a
 * `rich-text-element:add-files` event. Returns the updated element.
 *
 * Adds the element as a parent on the files references.
 *
 * - Throws a `RichTextElementNotFoundError` if the element does not exist.
 * - Throws a `FileReferenceNotFoundError` if any of the file references
 *   do not exist.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element to which to add the files.
 * @param fileIds The IDs of the file references of the files to add.
 * @returns The updated element.
 */
export function addFilesToRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string, fileIds: string[]): TElement {
  // Add the file IDs to the element
  const element = updateRichTextElement<TElement>(core, elementId, {
    files: FieldValue.arrayUnion(fileIds),
  });

  // Add the element as a parent on the files
  fileIds.forEach((id) => {
    Files.addAttachments(core, id, [elementId]);
  });

  // Get the updated file references
  const files = Files.get(fileIds);

  // Dispatch a 'rich-text-elements:add-files' event
  core.dispatch('rich-text-elements:add-files', { element, files });

  // Return the updated element
  return element;
}
