import { BlockElement, BlockElementProps } from '../../types';

export interface HorizontalRuleElementData {
  /**
   * The markdown used to create the horizontal rule.
   */
  markdown: string;
}

export type HorizontalRuleElement = BlockElement<HorizontalRuleElementData>;

export type HorizontalRuleElementProps =
  BlockElementProps<HorizontalRuleElement>;
