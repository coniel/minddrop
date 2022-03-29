import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { generateId } from '@minddrop/utils';
import { RichTextElementValidationError } from '../errors';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { CreateRichTextElementData, RichTextElement } from '../types';
import { useRichTextStore } from '../useRichTextStore';
import { validateRichTextElement } from '../validateRichTextElement';

/**
 * Creates a new rich text element and dispatches a `rich-text-elements:create`
 * event.
 *
 * Adds the element as a parent on files listed in the `files` property.
 *
 * The element type must be registered, if not, throws a
 * `RichTextElementTypeNotRegisteredError`.
 *
 * Throws a `RichTextElementValidationError` if the element contains invalid
 * data or is missing required fields.
 *
 * Returns the newly created element.
 *
 * @param core A MindDrop core instance.
 * @param data The element data.
 * @returns The newly created rich text element.
 */
export function createRichTextElement<
  TElement extends RichTextElement = RichTextElement,
  TData extends CreateRichTextElementData = CreateRichTextElementData,
>(core: Core, data: TData): TElement {
  // Get the element's config object
  const config = getRichTextElementConfig(data.type);

  if ('parents' in data) {
    // If the data contains a `parents` field, throw a
    // `RichTextElementValidationError`.
    throw new RichTextElementValidationError(
      'creating a rich text element with a `parents` property is forbidden, parents must be added after creation',
    );
  }

  // Generate a rich text element using the provided data
  const element: RichTextElement = {
    parents: [],
    id: generateId(),
    ...data,
  };

  if (!config.void && !element.children) {
    // If the element is non-void and has no children, add
    // an empty rich text node as its children.
    element.children = [{ text: '' }];
  }

  if (element.files) {
    // If the element has file attachments, add the element
    // as a parent on the attached files.
    element.files.forEach((fileId) => {
      Files.addAttachments(core, fileId, [element.id]);
    });
  }

  // Validate the element
  validateRichTextElement(element);

  // Add the element to the rich text store
  useRichTextStore.getState().setElement(element);

  // Dispatch a 'rich-text-elements:create' event
  core.dispatch('rich-text-elements:create', element);

  // Return the new element
  return element as TElement;
}
