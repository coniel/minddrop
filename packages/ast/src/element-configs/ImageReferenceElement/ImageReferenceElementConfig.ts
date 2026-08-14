import { ElementTypeConfig } from '../../types';
import { ImageReferenceElement } from './ImageReferenceElement.types';
import { stringifyImageReferenceElementToMarkdown } from './stringifyImageReferenceElementToMarkdown';

export const ImageReferenceElementConfig: ElementTypeConfig = {
  type: 'image-reference',
  level: 'inline',
  content: 'void',
  toMarkdown: stringifyImageReferenceElementToMarkdown,
  toPlainText: (element) => (element as ImageReferenceElement).alt || '',
};
