import { TypographyStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * Thousands separator style for number formatting.
 */
export type ThousandsSeparator = 'none' | 'comma' | 'period' | 'space';

/**
 * How to display the sign of a number.
 */
export type SignDisplay = 'auto' | 'always' | 'never';

/**
 * Number formatting options.
 */
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

/**
 * A property element rendering a number property.
 */
export interface NumberPropertyElement extends PropertyElementBase {
  propertyType: 'number';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * Number formatting options.
   */
  format?: NumberFormat;
}
