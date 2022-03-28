import { getRichTextElement } from './getRichTextElement';
import { getRichTextElementConfig } from './getRichTextElementConfig';
import { getRichTextElements } from './getRichTextElements';
import { registerRichTextElementType } from './registerRichTextElementType';
import { RichTextElementsApi } from './types';
import { unregisterRichTextElementType } from './unregisterRichTextElementType';

export const RichTextElements: RichTextElementsApi = {
  register: registerRichTextElementType,
  unregister: unregisterRichTextElementType,
  getConfig: getRichTextElementConfig,
  get: (elementId) =>
    Array.isArray(elementId)
      ? getRichTextElements(elementId)
      : getRichTextElement(elementId),
};
