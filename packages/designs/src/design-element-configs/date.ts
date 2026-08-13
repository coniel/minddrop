import { TypographyStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

/**
 * Whether to display an absolute date or a relative description.
 */
export type DateMode = 'date' | 'relative';

/**
 * Date style preset controlling the output format.
 */
export type DateStyle = 'compact' | 'short' | 'medium' | 'long' | 'full';

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

export interface DateElement extends DesignElementBase {
  type: 'date';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * Date content displayed when the element is static.
   * Stored as an ISO date string (YYYY-MM-DD).
   */
  content?: string;

  /**
   * Date formatting options.
   */
  format?: DateFormat;
}

export const DateElementConfig: DesignElementConfig<DateElement> = {
  type: 'date',
  icon: 'calendar',
  label: 'design-studio.elements.date',
  group: 'content',
  styleCategory: 'typography',
  compatiblePropertyTypes: ['date', 'created', 'last-modified'],
  template: {
    type: 'date',
    style: {},
  },
};
