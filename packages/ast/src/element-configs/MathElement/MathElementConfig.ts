import { ElementTypeConfig } from '../../types';
import { stringifyMathElementToMarkdown } from './stringifyMathElementToMarkdown';

export const MathElementConfig: ElementTypeConfig = {
  type: 'math',
  level: 'block',
  content: 'literal',
  toMarkdown: stringifyMathElementToMarkdown,
};
