import { RichTextElements } from '../RichTextElements';
import { RTElement, RTElementDocument, RTFragment } from '../types';

/**
 * Recursively replaces child ID strings with the
 * corresponding rich text elements for the given
 * rich text element document's children.
 *
 * @param elementDocument - The top level rich text element's document
 * @returns The top level rich text element
 */
export function generateChildrenTree(
  elementDocument: RTElementDocument,
): RTElement {
  if (!elementDocument.children) {
    return elementDocument as RTElement;
  }
  // Get the IDs of child elements
  const childIds = elementDocument.children
    ? (elementDocument.children.filter(
        (child) => typeof child === 'string',
      ) as string[])
    : [];

  // Get the child elements
  const children = RichTextElements.get(childIds);

  return {
    ...elementDocument,
    // Replace child element IDs with the elements themselves
    children: elementDocument.children
      .filter((child) => !!child)
      .map((child) =>
        // Replace element IDs with elements removing any potentially
        // undefined children.
        typeof child === 'string' && children[child]
          ? generateChildrenTree(children[child])
          : child,
      )
      // Remove any IDs left behind due the the child element not
      // existing.
      .filter((child) => typeof child !== 'string') as unknown as RTFragment,
  };
}
