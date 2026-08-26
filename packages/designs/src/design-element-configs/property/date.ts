import { TypographyStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * Whether to display an absolute date or a relative description.
 */
export type DateMode = 'date' | 'relative';

/**
 * Date style preset controlling the output format.
 */
export type DateStyle = 'compact' | 'short' | 'medium' | 'long' | 'full';

/**
 * Date formatting options.
 */
export interface DateFormat {
  /**
   * Whether to display an absolute date or a relative
   * description (e.g. "2 days ago").
   */
  mode: DateMode;

  /**
   * The date style preset.
   * 'compact' = 5/3/26, 'short' = 05/03/2026,
   * 'medium' = 5 Mar 2026, 'long' = 5 March 2026,
   * 'full' = Thu, 5 Mar 2026.
   */
  dateStyle: DateStyle;

  /**
   * Whether to include the time in the formatted output.
   */
  showTime: boolean;
}

/**
 * A property element rendering a date property.
 */
export interface DatePropertyElement extends PropertyElementBase {
  propertyType: 'date';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * Date formatting options.
   */
  format?: DateFormat;
}
