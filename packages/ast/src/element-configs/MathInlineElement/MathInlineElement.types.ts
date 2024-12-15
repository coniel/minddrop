import { Element } from '../../types';

export interface MathInlineElementData {
  expression: string;
}

export type MathInlineElement = Element<'math-inline', MathInlineElementData>;
