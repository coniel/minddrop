import { BlockElementConfig } from '../../types';
import { parseBookmarkElementFromMarkdown } from './parseBookmarkElementFromMarkdown';
import { stringifyBookmarkElementToMarkdown } from './stringifyBookmarkElementToMarkdown';

export const BookmarkElementConfig: BlockElementConfig = {
  type: 'bookmark',
  fromMarkdown: parseBookmarkElementFromMarkdown,
  toMarkdown: stringifyBookmarkElementToMarkdown,
};
