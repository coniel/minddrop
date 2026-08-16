import { ElementTypeConfig } from '../../types';
import { stringifyWikilinkElementToMarkdown } from './stringifyWikilinkElementToMarkdown';

export const WikilinkElementConfig: ElementTypeConfig = {
  type: 'wikilink',
  level: 'inline',
  // The label is part of the link's spelling rather than prose, so it holds
  // a single text child which carries no marks
  content: 'literal',
  toMarkdown: stringifyWikilinkElementToMarkdown,
};
