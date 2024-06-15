import { BlockElementConfig } from '../../types';
import { parseFileElementFromMarkdown } from './parseFileElementFromMarkdown';
import { stringifyFileElementToMarkdown } from './stringifyFileElementToMarkdown';

export const FileElementConfig: BlockElementConfig = {
  type: 'file',
  fromMarkdown: parseFileElementFromMarkdown,
  toMarkdown: stringifyFileElementToMarkdown,
};
