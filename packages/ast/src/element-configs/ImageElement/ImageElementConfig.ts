import { ElementTypeConfig } from '../../types';
import { ImageElement } from './ImageElement.types';
import { stringifyImageElementToMarkdown } from './stringifyImageElementToMarkdown';

export const ImageElementConfig: ElementTypeConfig = {
  type: 'image',
  level: 'inline',
  content: 'void',
  toMarkdown: stringifyImageElementToMarkdown,
  toPlainText: (element) => (element as ImageElement).alt || '',
};
