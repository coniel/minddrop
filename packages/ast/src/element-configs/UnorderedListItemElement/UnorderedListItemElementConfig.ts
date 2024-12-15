import { ElementTypeConfig } from '../../types';
import { stringifyUnorderedListItemElementBatchToMarkdown } from './stringifyUnorderedListItemElementBatchToMarkdown';
import { stringifyUnorderedListItemElementToMarkdown } from './stringifyUnorderedListItemElementToMarkdown';

export const UnorderedListItemElementConfig: ElementTypeConfig = {
  type: 'unordered-list-item',
  display: 'block',
  toMarkdown: stringifyUnorderedListItemElementToMarkdown,
  stringifyBatchToMarkdown: stringifyUnorderedListItemElementBatchToMarkdown,
};
