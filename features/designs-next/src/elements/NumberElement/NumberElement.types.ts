import { DesignElement, TextSettings } from '@minddrop/designs-next';
import {
  NumberNotation,
  NumberSeparator,
  NumberSignDisplay,
} from '@minddrop/utils';

export interface NumberElement extends DesignElement, TextSettings {
  /**
   * The decimal places the number is written with. Absent means
   * the places the number has.
   */
  decimals?: number;

  /**
   * The character the digits are grouped into thousands with.
   * Absent means none.
   */
  separator?: NumberSeparator;

  /**
   * Which numbers are written with their sign. Absent means
   * negative numbers alone.
   */
  signDisplay?: NumberSignDisplay;

  /**
   * How the number is written. Absent means standard.
   */
  notation?: NumberNotation;

  /**
   * The text written before the number.
   */
  prefix?: string;

  /**
   * The text written after the number.
   */
  suffix?: string;
}
