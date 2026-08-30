import { WikilinkElement } from '@minddrop/ast';
import { Editor } from '../types';
import { getInlines } from './getInlines';

/**
 * Returns the wikilinks within the first block.
 *
 * @param editor - An editor instance.
 * @returns The block's wikilink elements.
 */
export function getWikilinks(editor: Editor): WikilinkElement[] {
  return getInlines<WikilinkElement>(editor, 0, 'wikilink');
}
