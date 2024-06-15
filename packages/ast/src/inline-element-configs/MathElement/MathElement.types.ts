import { InlineElement } from '../../types';

export interface MathElementData {
  expression: string;
}

export type MathElement = InlineElement<'math', MathElementData>;
