import { ElementTypeConfig } from '../../types';
import { stringifyUnorderedListItemElementToMarkdown } from './stringifyUnorderedListItemElementToMarkdown';
import { stringifyUnorderedListItemElementBatchToMarkdown } from './stringifyUnorderedListItemElementBatchToMarkdown';

export const UnorderedListItemElementConfig: ElementTypeConfig = {
  type: 'unordered-list-item',
  display: 'block',
  toMarkdown: stringifyUnorderedListItemElementToMarkdown,
  stringifyBatchToMarkdown: stringifyUnorderedListItemElementBatchToMarkdown,
};
