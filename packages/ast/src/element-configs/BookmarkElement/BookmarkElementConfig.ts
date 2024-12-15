import { ElementTypeConfig } from '../../types';
import { stringifyBookmarkElementToMarkdown } from './stringifyBookmarkElementToMarkdown';

export const BookmarkElementConfig: ElementTypeConfig = {
  type: 'bookmark',
  display: 'block',
  isVoid: true,
  toMarkdown: stringifyBookmarkElementToMarkdown,
};
