import { BatchBlockElementStringifier } from '../../types';
import { UnorderedListItemElement } from './UnorderedListItemElement.types';
import { stringifyUnorderedListItemElementToMarkdown } from './stringifyUnorderedListItemElementToMarkdown';

/**
 * Stringifies consecutive markdown unordered-list-item elements into a
 * markdown unordered-list-item list string.
 *
 * @param element - The unordered-list-item elements to stringify.
 * @returns A markdown unordered-list-item list string.
 */
export const stringifyUnorderedListItemElementBatchToMarkdown: BatchBlockElementStringifier<
  UnorderedListItemElement
> = (element): string => {
  return element
    .map((element) => stringifyUnorderedListItemElementToMarkdown(element))
    .join('\n');
};
