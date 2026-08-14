import { ElementTypeConfig } from '../../types';
import { InlineMathElement } from './InlineMathElement.types';
import { stringifyInlineMathElementToMarkdown } from './stringifyInlineMathElementToMarkdown';

export const InlineMathElementConfig: ElementTypeConfig = {
  type: 'inline-math',
  level: 'inline',
  content: 'void',
  toMarkdown: stringifyInlineMathElementToMarkdown,
  toPlainText: (element) => (element as InlineMathElement).value,
};
