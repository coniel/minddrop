import { Core, DataInsert } from '@minddrop/core';
import { createRichTextElement } from '../createRichTextElement/createRichTextElement';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { CreateRichTextElementData, RichTextElement } from '../types';
import { RichTextFragment } from '../types/RichTextFragment.types';

/**
 * Creates a new rich text element of the given type by calling
 * the element config's `create` method. Dispatches a
 * `rich-text-elements:create` event and returns the newly
 * created element.
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
  // Get the element type config
  const config = getRichTextElementConfig(type);

  // The element data
  let elementData: CreateRichTextElementData;

  if (config.level === 'block' && !Array.isArray(data)) {
    // If the element is a block level element, and the data
    // is a DataInsert, create the element using the data.
    elementData = config.create(core, data);
  } else if (config.level === 'inline' && Array.isArray(data)) {
    // If the element is an inline level element, and the data
    // is a RichTextFragment, create the element using the data.
    elementData = config.create(core, data);
  } else {
    // If there is no data, or the data type does not match the
    // element level's expected data type, create the element
    // without data.
    elementData = config.create(core);
  }

  // Create the element
  const element = createRichTextElement<TElement>(core, elementData);

  // Return the new element
  return element;
}
