import { DefaultTextElementStyle, TextElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface DateFormat {
  /**
   * Whether to display an absolute date or a relative
   * description (e.g. "2 days ago").
   */
  mode: 'date' | 'relative';

  /**
   * The date style preset.
   * 'compact' = 5/3/26, 'short' = 05/03/2026,
   * 'medium' = 5 Mar 2026, 'long' = 5 March 2026,
   * 'full' = Thu, 5 Mar 2026.
   */
  dateStyle: 'compact' | 'short' | 'medium' | 'long' | 'full';

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
  style: TextElementStyle;

  /**
   * Placeholder date displayed when the element has no content.
   * Stored as an ISO date string (YYYY-MM-DD).
   */
  placeholder?: string;

  /**
   * Date formatting options.
   */
  format?: DateFormat;
}

export const DateElementConfig: DesignElementConfig = {
  type: 'date',
  icon: 'calendar',
  label: 'design-studio.elements.date',
  group: 'content',
  styleCategory: 'text',
  compatiblePropertyTypes: ['date', 'created', 'last-modified'],
  template: {
    type: 'date',
    style: { ...DefaultTextElementStyle },
    placeholder: new Date().toISOString().slice(0, 10),
  },
};
