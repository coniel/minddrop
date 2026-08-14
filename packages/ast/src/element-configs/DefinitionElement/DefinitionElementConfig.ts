import { ElementTypeConfig } from '../../types';
import { stringifyDefinitionElementToMarkdown } from './stringifyDefinitionElementToMarkdown';

export const DefinitionElementConfig: ElementTypeConfig = {
  type: 'definition',
  level: 'block',
  content: 'void',
  toMarkdown: stringifyDefinitionElementToMarkdown,
  // A definition is metadata rather than content
  toPlainText: () => '',
};
