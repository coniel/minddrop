import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { BlockElementStringifier } from '../../types';
import { UnorderedListItemElement } from './UnorderedListItemElement.types';

/**
 * Stringifies unordered-list-item elements to markdown.
 *
 * @param element - The unordered-list-item element to stringify.
 * @returns A markdown unordered-list-item string.
 */
export const stringifyUnorderedListItemElementToMarkdown: BlockElementStringifier<
  UnorderedListItemElement
> = (element: UnorderedListItemElement): string => {
  // Each level of nesting is represented by 4 spaces
  const nestingPadding = ' '.repeat((element.depth || 0) * 4);
  // The unordered-list-item text content
  const content = stringifyFragmentToMarkdown(element.children);

  return `${nestingPadding}- ${content}`;
};
