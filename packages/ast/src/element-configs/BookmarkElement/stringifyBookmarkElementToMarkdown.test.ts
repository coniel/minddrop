import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { BookmarkElement } from './BookmarkElement.types';
import { stringifyBookmarkElementToMarkdown } from './stringifyBookmarkElementToMarkdown';

const bookmark = generateElement<BookmarkElement>('bookmark', {
  title: 'Example Title',
  url: 'https://example.com',
  description: 'Example description',
});

describe('stringifyBookmarkElementToMarkdown', () => {
  it('stringifies the bookmark', () => {
    expect(stringifyBookmarkElementToMarkdown(bookmark)).toBe(
      `[${bookmark.title}](${bookmark.url} "${bookmark.description}")`,
    );
  });

  it('stringifies the bookmark without a description', () => {
    const element = { ...bookmark, description: undefined };
    expect(stringifyBookmarkElementToMarkdown(element)).toBe(
      `[${element.title}](${element.url})`,
    );
  });
});
