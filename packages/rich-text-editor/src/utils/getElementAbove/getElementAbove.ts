import { RichTextElement } from '../../types';
import { Editor, Element, NodeEntry, Range, Path, Point } from 'slate';

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
): NodeEntry<RichTextElement> | null =>
  Editor.above(editor, {
    match: (n) => Element.isElement(n),
    ...options,
  }) || null;
