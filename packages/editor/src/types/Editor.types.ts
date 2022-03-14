import { BaseEditor } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';

export type EditorText = { text: string };

export interface EditorElement {
  /**
   * The element type identifier, e.g. 'paragraph'.
   */
  type: string;

  /**
   * The content of the element.
   */
  children?: EditorText[] | EditorElement[];
}

export type EditorContent = EditorElement[];

export type ElementProps = RenderElementProps;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: EditorElement;
    Text: EditorText;
  }
}
