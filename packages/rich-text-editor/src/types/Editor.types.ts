import { BaseEditor, Editor as SlateEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { RichTextNode } from './RichTextNode.types';
import { RichTextElement } from './RichTextElement.types';

interface MindDropEditor {
  /**
   * Toggles a mark on the current selection.
   */
  toggleMark(mark: string, value?: boolean | string | number): void;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: RichTextElement;
    Text: RichTextNode;
  }
}

export type Editor = SlateEditor & ReactEditor & MindDropEditor;
