import { RichText } from './RichText.types';
import { RichTextElement } from './RichTextBlockElement.types';

declare module 'slate' {
  interface CustomTypes {
    Element: RichTextElement;
    Text: RichText;
  }
}
