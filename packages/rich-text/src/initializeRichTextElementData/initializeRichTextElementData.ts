import { DataInsert } from '@minddrop/core';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import {
  RichTextElement,
  RichTextElementConfig,
  RichTextFragment,
} from '../types';

/**
 * Returns an element's initial data, initialized using the
 * element type config's `initializeData` method if present.
 *
 * - Throws a `RichTextElementTypeNotRegisteredError` if the
 *   element type is not registered.
 *
 * @param type The element type.
 * @param data The data from which to create the element.
 * @returns The element's creation data.
 */
export function initializeRichTextElementData<TData = {}>(
  type: string,
  data?: DataInsert | RichTextFragment,
): TData {
  // Get the element type's configuration object
  const config =
    getRichTextElementConfig<RichTextElementConfig<RichTextElement, TData>>(
      type,
    );

  if (!config.initializeData) {
    // If the element's config does no have an `initializeData`
    // method, there is no data to initialize.
    return {} as TData;
  }

  if (config.level === 'block' && !Array.isArray(data)) {
    // If the element is a block level element, and the data
    // is a DataInsert, create the element using the data.
    return config.initializeData(data);
  }

  if (config.level === 'inline' && Array.isArray(data)) {
    // If the element is an inline level element, and the data
    // is a RichTextFragment, create the element using the data.
    return config.initializeData(data);
  }

  // If there is no data, or the data type does not match the
  // element level's expected data type, create the element
  // without data.
  return config.initializeData();
}
