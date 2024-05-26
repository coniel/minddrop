import { BaseEditor, Editor as SlateEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { Text } from './Text.types';
import { Element } from './Element.types';

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
    Text: Text;
  }
}

export type Editor = SlateEditor & ReactEditor & MindDropEditor;
