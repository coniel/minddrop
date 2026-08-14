import { Element } from '../../types';

export interface MathElementData {
  /**
   * The remainder of the opening fence's line, after the delimiter.
   */
  meta?: string | null;
}

export type MathElement = Element<'math', MathElementData>;
