import { Element } from '@minddrop/ast';
import { Editor } from '../../types';
import { TITLE_ELEMENT_TYPE } from '../../withTitle/TitleElement';

/**
 * Gets the index of the editor's first content block, which is the
 * second node in editors rendering a title.
 *
 * @param editor An editor instance.
 * @returns The index of the first content block.
 */
export function getContentStartIndex(editor: Editor): number {
  const firstBlock = editor.children[0] as Element | undefined;

  return firstBlock?.type === TITLE_ELEMENT_TYPE ? 1 : 0;
}
