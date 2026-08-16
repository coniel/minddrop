import { Path } from 'slate';
import { Element } from '@minddrop/ast';
import { Editor } from './Editor.types';

export interface BlockShortcut {
  /**
   * The text which triggers the shortcut when typed at the start of a block.
   */
  trigger: string;

  /**
   * Applies the shortcut to the block, the trigger text having already been
   * removed.
   */
  apply(editor: Editor, path: Path, element: Element): void;
}
