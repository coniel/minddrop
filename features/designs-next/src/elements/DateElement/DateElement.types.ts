import { DesignElement, TextSettings } from '@minddrop/designs-next';
import { DateMode, DateStyle } from '@minddrop/utils';

export interface DateElement extends DesignElement, TextSettings {
  /**
   * How the date reads. Absent means as the date itself.
   */
  mode?: DateMode;

  /**
   * The length the date is formatted at when it reads as the date
   * itself. Absent means medium.
   */
  dateStyle?: DateStyle;

  /**
   * Whether the time of day follows a date read as the date itself.
   */
  showTime?: boolean;
}
