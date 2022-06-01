import { BaseEditor, Editor as SlateEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { RTNode, RTElement } from '@minddrop/rich-text';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: RTElement;
    Text: RTNode;
  }
}

export type Editor = SlateEditor;
