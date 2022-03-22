import { generateRichTextDocument } from './generateRichTextDocument';
import { toPlainText } from './toPlainText';
import { RichTextApi } from './types/RichTextApi.types';

export const RichText: RichTextApi = {
  generateDocument: generateRichTextDocument,
  toPlainText,
};
