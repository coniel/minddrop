import { BlockElementConfig } from '../../types';
import { parseHeadingElementFromMarkdown } from './parseHeadingElementFromMarkdown';
import { stringifyHeadingElementToMarkdown } from './stringifyHeadingElementFromMarkdown';

export const HeadingElementConfig: BlockElementConfig = {
  type: 'heading',
  fromMarkdown: parseHeadingElementFromMarkdown,
  toMarkdown: stringifyHeadingElementToMarkdown,
};
