import { Element } from '../../types';

export interface ThematicBreakElementData {
  /**
   * The break as authored, preserving which character was used and how it
   * was spaced.
   */
  syntax: string;
}

export type ThematicBreakElement = Element<
  'thematic-break',
  ThematicBreakElementData
>;
