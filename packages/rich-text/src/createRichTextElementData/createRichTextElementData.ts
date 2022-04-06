import { DataInsert } from '@minddrop/core';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import {
  CreateRichTextElementData,
  RichTextElement,
  RichTextElementConfig,
  RichTextFragment,
} from '../types';

/**
 * Returns an element's creation data, including `type` and
 * custom data initialized using the element type config's
 * `initializeData` method if present.
 *
 * - Throws a `RichTextElementTypeNotRegisteredError` if the
 *   element type is not registered.
 *
 * @param type The element type.
 * @param data The data from which to create the element.
 * @returns The element's creation data.
 */
export function createRichTextElementData<TData = {}>(
  type: string,
  data?: DataInsert | RichTextFragment,
): CreateRichTextElementData & TData {
  // Get the element type's configuration object
  const config =
    getRichTextElementConfig<RichTextElementConfig<RichTextElement, TData>>(
      type,
    );

  // The element data
  let elementData: CreateRichTextElementData = { type };

  if (
    config.initializeData &&
    config.level === 'block' &&
    !Array.isArray(data)
  ) {
    // If the element is a block level element, and the data
    // is a DataInsert, create the element using the data.
    elementData = { ...elementData, ...config.initializeData(data) };
  } else if (
    config.initializeData &&
    config.level === 'inline' &&
    Array.isArray(data)
  ) {
    // If the element is an inline level element, and the data
    // is a RichTextFragment, create the element using the data.
    elementData = { ...elementData, ...config.initializeData(data) };
  } else if (config.initializeData) {
    // If there is no data, or the data type does not match the
    // element level's expected data type, create the element
    // without data.
    elementData = { ...elementData, ...config.initializeData() };
  }

  return elementData as CreateRichTextElementData & TData;
}
