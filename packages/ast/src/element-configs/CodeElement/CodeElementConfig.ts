import { ElementTypeConfig } from '../../types';
import { stringifyCodeElementToMarkdown } from './stringifyCodeElementToMarkdown';

export const CodeElementConfig: ElementTypeConfig = {
  type: 'code',
  level: 'block',
  content: 'literal',
  toMarkdown: stringifyCodeElementToMarkdown,
};
