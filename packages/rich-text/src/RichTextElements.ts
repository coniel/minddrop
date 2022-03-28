import { getRichTextElementConfig } from './getRichTextElementConfig';
import { registerRichTextElementType } from './registerRichTextElementType';
import { RichTextElementsApi } from './types';
import { unregisterRichTextElementType } from './unregisterRichTextElementType';

export const RichTextElements: RichTextElementsApi = {
  register: registerRichTextElementType,
  unregister: unregisterRichTextElementType,
  getConfig: getRichTextElementConfig,
};
