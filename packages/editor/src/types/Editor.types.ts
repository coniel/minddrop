import { BaseEditor, Editor as SlateEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { Element, TextElement } from '@minddrop/ast';

interface MindDropEditor {
  /**
   * Toggles a mark on the current selection.
   */
  toggleMark(mark: string, value?: boolean | string | number): void;

  /**
   * Whether a block selection covering a single block was entered
   * deliberately, such as by pressing Escape or clicking a block's
   * drag handle.
   *
   * Such a selection is otherwise indistinguishable from having
   * selected all of a block's text, which is not a block selection.
   */
  blockSelectionMode: boolean;
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
