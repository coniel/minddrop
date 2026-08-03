import { Node, Path, Element as SlateElement, Text } from 'slate';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';

/**
 * Enforces plain text content rules on the element at the given
 * path: nested elements are unwrapped, marks are stripped, and
 * line breaks are removed. Fixes at most one issue per call so
 * it can be used within `normalizeNode` without causing
 * normalization loops.
 *
 * @param editor - The editor instance.
 * @param path - The path of the element to normalize.
 * @returns Whether a fix was applied.
 */
export function normalizePlainTextContent(editor: Editor, path: Path): boolean {
  for (const [child, childPath] of Node.children(editor, path)) {
    // Unwrap elements nested inside the plain text element
    if (SlateElement.isElement(child)) {
      Transforms.unwrapNodes(editor, { at: childPath });

      return true;
    }

    if (Text.isText(child)) {
      // Mark properties present on the text
      const markKeys = Object.keys(child).filter((key) => key !== 'text');

      // Strip marks from the text
      if (markKeys.length > 0) {
        Transforms.unsetNodes(editor, markKeys, { at: childPath });

        return true;
      }

      // Remove newline characters from the text
      if (child.text.includes('\n')) {
        const newlineOffset = child.text.indexOf('\n');

        Transforms.delete(editor, {
          at: {
            anchor: { path: childPath, offset: newlineOffset },
            focus: { path: childPath, offset: newlineOffset + 1 },
          },
        });

        return true;
      }
    }
  }

  return false;
}
