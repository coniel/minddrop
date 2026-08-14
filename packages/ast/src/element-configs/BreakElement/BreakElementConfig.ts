import { ElementTypeConfig } from '../../types';
import { stringifyBreakElementToMarkdown } from './stringifyBreakElementToMarkdown';

export const BreakElementConfig: ElementTypeConfig = {
  type: 'break',
  level: 'inline',
  content: 'void',
  toMarkdown: stringifyBreakElementToMarkdown,
  toPlainText: () => '\n',
};
