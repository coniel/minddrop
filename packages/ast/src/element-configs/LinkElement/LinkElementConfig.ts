import { ElementTypeConfig } from '../../types';
import { stringifyLinkElementToMarkdown } from './stringifyLinkElementToMarkdown';

export const LinkElementConfig: ElementTypeConfig = {
  type: 'link',
  level: 'inline',
  content: 'inline',
  toMarkdown: stringifyLinkElementToMarkdown,
};
