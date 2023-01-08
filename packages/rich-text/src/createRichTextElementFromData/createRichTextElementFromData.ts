import { Core, DataInsert } from '@minddrop/core';
import { RTElement, RTFragment, RTElementTypeData } from '../types';
import { RTElementsResource } from '../RTElementsResource';
import { initializeRichTextElementData } from '../initializeRichTextElementData';

/**
 * Creates a new rich text element of the given type.
 * Dispatches a `rich-text:element:create` event
 *
 * Returns the newly created element.
 *
 * - If creating a 'block' level element from data, the data must be
 *   a `DataInsert`.
 * - If creating an 'inline' level element, the data must be a
 *   `RTFragment`.
 *
 * @param core - A MindDrop core instance.
 * @param type - The element type to create.
 * @param data - The data from which to create the element.
 * @returns The new element.
 *
 * @throws ResourceTypeNotRegisteredError
 * Thrown if the rich text element type is not registered.
 *
 * @throws ResourceValidationError
 * Thrown if the data is invalid.
 */
export function createRichTextElementFromData<
  TTypeData extends RTElementTypeData = {},
>(
  core: Core,
  type: string,
  data?: DataInsert | RTFragment,
): RTElement<TTypeData> {
  // Create the element data
  const elementData = initializeRichTextElementData<TTypeData>(type, data);

  // Create the element
  const element = RTElementsResource.create<
    Partial<RTElement<TTypeData>>,
    TTypeData
  >(core, type, {
    ...elementData,
    type,
  });

  // Return the new element
  return element;
}
