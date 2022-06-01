import { RTElementsApi } from './types';
import { toPlainText } from './toPlainText';
import { RTElementsResource } from './RTElementsResource';
import { createRichTextElementFromData } from './createRichTextElementFromData/createRichTextElementFromData';
import { convertRichTextElement } from './convertRichTextElement';
import { initializeRichTextElementData } from './initializeRichTextElementData';

export const RichTextElements: RTElementsApi = {
  ...RTElementsResource,
  toPlainText,
  convert: convertRichTextElement,
  createFromData: createRichTextElementFromData,
  initializeData: initializeRichTextElementData,
  addEventListener: (core, type, callback) =>
    core.addEventListener(type, callback),
  removeEventListener: (core, type, callback) =>
    core.removeEventListener(type, callback),
};
