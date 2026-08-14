import { ElementTypeConfig } from '../../types';
import { stringifyThematicBreakElementToMarkdown } from './stringifyThematicBreakElementToMarkdown';

export const ThematicBreakElementConfig: ElementTypeConfig = {
  type: 'thematic-break',
  level: 'block',
  content: 'void',
  toMarkdown: stringifyThematicBreakElementToMarkdown,
  // A break carries no text content
  toPlainText: () => '',
};
