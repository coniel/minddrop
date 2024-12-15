import { Element } from '../../types';

export interface MathBlockElementData {
  expression: string;
}

export type MathBlockElement = Element<'math-block', MathBlockElementData>;
