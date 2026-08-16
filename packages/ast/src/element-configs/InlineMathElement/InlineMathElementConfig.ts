import { ElementTypeConfig } from '../../types';
import { stringifyInlineMathElementToMarkdown } from './stringifyInlineMathElementToMarkdown';

export const InlineMathElementConfig: ElementTypeConfig = {
  type: 'inline-math',
  level: 'inline',
  // The expression is raw content rather than prose, so it holds a single
  // text child which carries no marks and is not parsed for inline syntax
  content: 'literal',
  toMarkdown: stringifyInlineMathElementToMarkdown,
};
