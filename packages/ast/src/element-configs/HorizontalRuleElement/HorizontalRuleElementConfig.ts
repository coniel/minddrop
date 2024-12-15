import { ElementTypeConfig } from '../../types';
import { stringifyHorizontalRuleElementToMarkdown } from './stringifyHorizontalRuleElementToMarkdown';

export const HorizontalRuleElementConfig: ElementTypeConfig = {
  type: 'horizontal-rule',
  display: 'block',
  isVoid: true,
  toMarkdown: stringifyHorizontalRuleElementToMarkdown,
};
