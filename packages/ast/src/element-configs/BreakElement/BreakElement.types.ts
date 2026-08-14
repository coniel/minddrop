import { Element } from '../../types';

export interface BreakElementData {
  /**
   * The break as authored, either two or more trailing spaces or a
   * backslash.
   */
  syntax?: string;
}

export type BreakElement = Element<'break', BreakElementData>;
