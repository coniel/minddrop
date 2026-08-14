import { ElementTypeConfig } from '../../types';
import { stringifyUnsupportedElementToMarkdown } from './stringifyUnsupportedElementToMarkdown';

export const UnsupportedElementConfig: ElementTypeConfig = {
  type: 'unsupported',
  level: 'block',
  content: 'void',
  toMarkdown: stringifyUnsupportedElementToMarkdown,
  // The construct is not modelled, so its source is not known to be text
  toPlainText: () => '',
};
