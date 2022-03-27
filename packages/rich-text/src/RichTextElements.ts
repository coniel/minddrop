import { registerRichTextElementType } from './registerRichTextElementType';
import { RichTextElementsApi } from './types';

export const RichTextElements: RichTextElementsApi = {
  register: registerRichTextElementType,
};
