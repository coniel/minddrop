import { RTElementsApi } from './types';
import { generateChildrenTree } from './generateChildrenTree';
import { toPlainText } from './toPlainText';
import { RTElementsResource } from './RTElementsResource';
import { createRichTextElementFromData } from './createRichTextElementFromData/createRichTextElementFromData';
import { convertRichTextElement } from './convertRichTextElement';
import { initializeRichTextElementData } from './initializeRichTextElementData';

export const RichTextElements: RTElementsApi = {
  ...RTElementsResource,
  generateChildrenTree,
  toPlainText,
  convert: convertRichTextElement,
  createFromData: createRichTextElementFromData,
  initializeData: initializeRichTextElementData,
  addEventListener: (core, type, callback) =>
    core.addEventListener(type, callback),
  removeEventListener: (core, type, callback) =>
    core.removeEventListener(type, callback),
};

/**
 * Returns a rich text element by ID.
 *
 * @param elementId - The ID of the rich text element to retrieve.
 * @returns A rich text element or `null` if it does not exist.
 */
export const useRichTextElement = (elementId: string) =>
  RTElementsResource.hooks.useDocument(elementId);

/**
 * Returns rich text elements by ID.
 *
 * @param elementIds - The IDs of the rich text elements to retrieve.
 * @returns A `{ [id]: RTElement }` map of rich text elements.
 */
export const useRichTextElements = (elementIds: string[]) =>
  RTElementsResource.hooks.useDocuments(elementIds);

/**
 * Returns all registered rich text element type
 * config objects.
 */
export const useRichTextElementTypeConfigs =
  RTElementsResource.hooks.useAllTypeConfigs;
