import { Element } from '@minddrop/ast';
import {
  Editor,
  Element as SlateElement,
  NodeEntry,
  Range,
  Path,
  Point,
} from 'slate';

interface Options {
  at?: Range | Path | Point;
  mode?: 'highest' | 'lowest';
  voids?: boolean;
}

/**
 * Gets the element above a location (default: selection).
 * If there is no element above, returns `null`
 *
 * @param editor An editor.
 * @param options Search options.
 * @returns The element above or `null`.
 */
export const getElementAbove = (
  editor: Editor,
  options: Options = {},
): NodeEntry<Element> | null =>
  Editor.above(editor, {
    match: (n) => SlateElement.isElement(n),
    ...options,
  }) || null;
