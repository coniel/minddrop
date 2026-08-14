import { Element } from '../../types';

export interface InlineMathElementData {
  /**
   * The expression as authored.
   */
  value: string;
}

export type InlineMathElement = Element<'inline-math', InlineMathElementData>;
