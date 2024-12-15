import { ElementTypeConfig } from '../../types';
import { stringifyFileElementToMarkdown } from './stringifyFileElementToMarkdown';

export const FileElementConfig: ElementTypeConfig = {
  type: 'file',
  display: 'block',
  isVoid: true,
  toMarkdown: stringifyFileElementToMarkdown,
};
