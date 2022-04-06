import { Core, DataInsert } from '@minddrop/core';
import { createRichTextElement } from '../createRichTextElement/createRichTextElement';
import { initializeRichTextElementData } from '../initializeRichTextElementData';
import { RichTextElement } from '../types';
import { RichTextFragment } from '../types/RichTextFragment.types';

/**
 * Creates a new rich text element of the given type.
 * Dispatches a `rich-text-elements:create` event and
 * returns the newly created element.
 *
 * - Throws a `RichTextElementTypeNotRegisteredError` if the
 *   element type is not registered.
 *
 * @param core A MindDrop core instance.
 * @param type The element type to create.
 * @param data A data insert object from which to create the element.
 * @returns The new element.
 */
export function createRichTextElementOfType<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, type: string, data?: DataInsert | RichTextFragment): TElement {
  // Create the element data
  const elementData = initializeRichTextElementData(type, data);

  // Create the element
  const element = createRichTextElement<TElement>(core, {
    ...elementData,
    type,
  });

  // Return the new element
  return element;
}
