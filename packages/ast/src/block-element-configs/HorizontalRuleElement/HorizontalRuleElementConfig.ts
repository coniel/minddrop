import { BlockElementConfig } from '../../types';
import { parseHorizontalRuleElementFromMarkdown } from './parseHorizontalRuleElementFromMarkdown';
import { stringifyHorizontalRuleElementToMarkdown } from './stringifyHorizontalRuleElementToMarkdown';

export const HorizontalRuleElementConfig: BlockElementConfig = {
  type: 'horizontal-rule',
  fromMarkdown: parseHorizontalRuleElementFromMarkdown,
  toMarkdown: stringifyHorizontalRuleElementToMarkdown,
};
