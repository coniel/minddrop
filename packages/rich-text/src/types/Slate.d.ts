import { RichText } from './RichText.types';
import { RichTextElement } from './RichTextElement.types';

declare module 'slate' {
  interface CustomTypes {
    Element: RichTextElement;
    Text: RichText;
  }
}
