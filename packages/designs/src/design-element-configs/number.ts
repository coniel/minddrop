import { TypographyStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

/**
 * Thousands separator style for number formatting.
 */
export type ThousandsSeparator = 'none' | 'comma' | 'period' | 'space';

/**
 * How to display the sign of a number.
 */
export type SignDisplay = 'auto' | 'always' | 'never';

export interface NumberFormat {
  /**
   * Number of decimal places to display.
   */
  decimals: number;

  /**
   * Thousands separator style.
   */
  thousandsSeparator: ThousandsSeparator;

  /**
   * Text displayed before the number.
   */
  prefix: string;

  /**
   * Text displayed after the number.
   */
  suffix: string;

  /**
   * How to display the sign of the number.
   */
  signDisplay: SignDisplay;
}

export interface NumberElement extends DesignElementBase {
  type: 'number';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * Number content displayed when the element is static.
   */
  content?: string;

  /**
   * Number formatting options.
   */
  format?: NumberFormat;
}

export const NumberElementConfig: DesignElementConfig<NumberElement> = {
  type: 'number',
  icon: 'hash',
  label: 'design-studio.elements.number',
  group: 'content',
  styleCategory: 'typography',
  compatiblePropertyTypes: ['number'],
  template: {
    type: 'number',
    style: {},
  },
};
