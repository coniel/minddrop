import { registerRichTextElementConfig } from './registerRichTextElementConfig';
import { registerRichTextMarkConfig } from './registerRichTextMarkConfig';
import { unregisterRichTextElementConfig } from './unregisterRichTextElementConfig';
import { unregisterRichTextMarkConfig } from './unregisterRichTextMarkConfig';
import { RichTextApi } from './types';

export const RichText: RichTextApi = {
  registerElement: registerRichTextElementConfig,
  unregisterElement: unregisterRichTextElementConfig,
  registerMark: registerRichTextMarkConfig,
  unregisterMark: unregisterRichTextMarkConfig,
};
