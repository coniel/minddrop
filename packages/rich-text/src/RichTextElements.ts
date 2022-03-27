import { getRichTextElementConfig } from './getRichTextElementConfig';
import { registerRichTextElementType } from './registerRichTextElementType';
import { RichTextElementsApi } from './types';

export const RichTextElements: RichTextElementsApi = {
  register: registerRichTextElementType,
  getConfig: getRichTextElementConfig,
};
