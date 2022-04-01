import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { RichTextNode, RichTextElement } from '@minddrop/rich-text';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: RichTextElement;
    Text: RichTextNode;
  }
}
