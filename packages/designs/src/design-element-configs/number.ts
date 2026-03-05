import { DefaultTextElementStyle, TextElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import { generateNumberPlaceholder } from './placeholder-generators';

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

  /**
   * Optional text style overrides for the prefix.
   */
  prefixStyle?: Partial<TextElementStyle>;

  /**
   * Optional text style overrides for the suffix.
   */
  suffixStyle?: Partial<TextElementStyle>;
}

export interface NumberElement extends DesignElementBase {
  type: 'number';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Placeholder number displayed when the element has no content.
   */
  placeholder?: string;

  /**
   * Number formatting options.
   */
  format?: NumberFormat;
}

export const NumberElementConfig: DesignElementConfig = {
  type: 'number',
  icon: 'hash',
  label: 'design-studio.elements.number',
  group: 'content',
  styleCategory: 'text',
  compatiblePropertyTypes: ['number'],
  template: {
    type: 'number',
    style: { ...DefaultTextElementStyle },
  },
  generatePlaceholder: () => generateNumberPlaceholder(3),
};
