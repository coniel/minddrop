import { ElementTypeConfig } from '../../types';
import { stringifyLinkReferenceElementToMarkdown } from './stringifyLinkReferenceElementToMarkdown';

export const LinkReferenceElementConfig: ElementTypeConfig = {
  type: 'link-reference',
  level: 'inline',
  content: 'inline',
  toMarkdown: stringifyLinkReferenceElementToMarkdown,
};
