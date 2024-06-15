import { describe, it, expect } from 'vitest';
import { stringifyBookmarkElementToMarkdown } from './stringifyBookmarkElementToMarkdown';
import { BookmarkElement } from './BookmarkElement.types';
import { generateVoidBlockElement } from '../../utils';

const bookmark = generateVoidBlockElement<BookmarkElement>('bookmark', {
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
