import { RichTextNode } from './RichTextNode.types';
import { RichTextElement } from './RichTextBlockElement.types';

declare module 'slate' {
  interface CustomTypes {
    Element: RichTextElement;
    Text: RichTextNode;
  }
}
