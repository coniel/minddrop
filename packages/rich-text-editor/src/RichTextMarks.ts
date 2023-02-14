import { registerRichTextMark } from './registerRichTextMark';
import { RTMarkConfigsStore } from './RTMarkConfigsStore';
import { unregisterRichTextMark } from './unregisterRichTextMark';

export const RichTextMarks = {
  ...RTMarkConfigsStore,
  register: registerRichTextMark,
  unregister: unregisterRichTextMark,
};
