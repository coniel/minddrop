import { TextBlockElement } from '../../types';

export interface MathBlockElementData {
  expression: string;
}

export type MathBlockElement = TextBlockElement<
  'math-block',
  MathBlockElementData
>;
