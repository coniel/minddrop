import { UnorderedListItemElement } from './UnorderedListItemElement.types';
import { stringifyUnorderedListItemElementToMarkdown } from './stringifyUnorderedListItemElementToMarkdown';

/**
 * Stringifies consecutive markdown unordered-list-item elements into a
 * markdown unordered-list-item list string.
 *
 * @param element - The unordered-list-item elements to stringify.
 * @returns A markdown unordered-list-item list string.
 */
export const stringifyUnorderedListItemElementBatchToMarkdown = (
  elements: UnorderedListItemElement[],
): string => {
  return elements
    .map((element) => stringifyUnorderedListItemElementToMarkdown(element))
    .join('\n');
};
