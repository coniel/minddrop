import { DataInsert } from '@minddrop/core';
import { RTFragment, RTElementTypeData, RTElement } from '../types';
import { RTElementsResource } from '../RTElementsResource';

/**
 * Returns an element's initial data, initialized using the
 * element type config's `initializeData` method if present
 * or an empty object otherwise.
 *
 * @param type - The element type.
 * @param data - The data from which to create the element.
 * @returns The element's creation data.
 *
 * @throws ResourceTypeNotRegisteredError
 * Thrown if the rich text element type is not registered.
 */
export function initializeRichTextElementData<TData extends RTElementTypeData>(
  type: string,
  data?: DataInsert | RTFragment,
): Partial<RTElement<TData>> {
  // Get the element type's configuration object
  const config = RTElementsResource.getTypeConfig(type);

  if (!config.initializeData) {
    // If the element's config does no have an `initializeData`
    // method, there is no data to initialize.
    return {} as Partial<RTElement<TData>>;
  }

  if (config.level === 'block' && !Array.isArray(data)) {
    // If the element is a block level element, and the data
    // is a DataInsert, create the element using the data.
    return config.initializeData(data) as Partial<RTElement<TData>>;
  }

  if (config.level === 'inline' && Array.isArray(data)) {
    // If the element is an inline level element, and the data
    // is a RTFragment, create the element using the data.
    return config.initializeData(data) as Partial<RTElement<TData>>;
  }

  // If there is no data, or the data type does not match the
  // element level's expected data type, create the element
  // without data.
  return config.initializeData() as Partial<RTElement<TData>>;
}
