import { BaseEditor, Editor as SlateEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { BlockElement, InlineElement, TextElement } from '@minddrop/ast';

interface MindDropEditor {
  /**
   * Toggles a mark on the current selection.
   */
  toggleMark(mark: string, value?: boolean | string | number): void;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: BlockElement | InlineElement;
    Text: TextElement;
    Descendant: BlockElement | InlineElement | TextElement;
    Node: BlockElement | InlineElement | TextElement;
  }
}

export type Editor = SlateEditor & ReactEditor & MindDropEditor;
