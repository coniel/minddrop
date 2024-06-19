import { BlockElementConfig } from '../../types';
import { parseUnorderedListItemElementFromMarkdown } from './parseUnorderedListItemElementFromMarkdown';
import { stringifyUnorderedListItemElementToMarkdown } from './stringifyUnorderedListItemElementToMarkdown';
import { stringifyUnorderedListItemElementBatchToMarkdown } from './stringifyUnorderedListItemElementBatchToMarkdown';

export const UnorderedListItemElementConfig: BlockElementConfig = {
  type: 'unordered-list-item',
  fromMarkdown: parseUnorderedListItemElementFromMarkdown,
  toMarkdown: stringifyUnorderedListItemElementToMarkdown,
  stringifyBatchToMarkdown: stringifyUnorderedListItemElementBatchToMarkdown,
};
