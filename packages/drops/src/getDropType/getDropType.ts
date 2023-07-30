import { isImageUrl } from '@minddrop/utils';
import { Drop } from '../types';

/**
 * Identifies a drop's type based on its child MD AST nodes.
 *
 * @params children - The drop's child MD AST nodes.
 * @returns The drop type.
 */
export function getDropType(children: Drop['children']): Drop['type'] {
  const [firstChild] = children;

  if (children.length === 1) {
    // Drop content conists of a single level 1 or 2 heading
    if (firstChild.type === 'heading' && firstChild.depth < 3) {
      return 'heading';
    }

    // Drop content conists of a single blockquote
    if (firstChild.type === 'blockquote') {
      return 'blockquote';
    }

    // Drop content conists of a table
    if (firstChild.type === 'table') {
      return 'table';
    }

    // Drop content consists of a single paragraph containing
    // a link as its only child.
    if (
      firstChild.type === 'paragraph' &&
      firstChild.children.length === 1 &&
      firstChild.children[0].type === 'link'
    ) {
      return 'link';
    }
  }

  // Drop content starts with a paragraph containing an image
  // (or file) as its first child.
  if (
    firstChild.type === 'paragraph' &&
    firstChild.children[0]?.type === 'image'
  ) {
    // Check if the file is an image
    if (isImageUrl(firstChild.children[0].url)) {
      return 'image';
    }

    return 'file';
  }

  return 'text';
}
