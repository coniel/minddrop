import { LinkElement } from '@minddrop/ast';
import { Editor } from '../types';
import { getInlines } from './getInlines';

/**
 * Returns the links within the first block.
 *
 * @param editor - An editor instance.
 * @returns The block's link elements.
 */
export function getLinks(editor: Editor): LinkElement[] {
  return getInlines<LinkElement>(editor, 0, 'link');
}
