import { BaseEditor, Editor as SlateEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { Element, TextElement } from '@minddrop/ast';

interface MindDropEditor {
  /**
   * Toggles a mark on the current selection.
   */
  toggleMark(mark: string, value?: boolean | string | number): void;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Element;
    Text: TextElement;
    Descendant: Element | TextElement;
    Node: Element | TextElement;
  }
}

export type Editor = SlateEditor & ReactEditor & MindDropEditor;
