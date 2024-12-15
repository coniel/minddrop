import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateElement } from '../../utils';
import { BookmarkElement } from './BookmarkElement.types';
import { parseBookmarkElementFromMarkdown } from './parseBookmarkElementFromMarkdown';

const consume = vi.fn();
const getNextLine = vi.fn();

const bookmarkElement = generateElement<BookmarkElement>('bookmark', {
  url: 'https://example.com',
  title: 'Title',
  description: '',
});

describe('parseBookmarkElementFromMarkdown', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('matches bookmarks', () => {
    const line = '[Title](https://example.com)';

    const element = parseBookmarkElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(element).toEqual(bookmarkElement);
  });

  it('matches bookmarks with a description', () => {
    const line = '[Title](https://example.com "Description")';

    const element = parseBookmarkElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(element).toEqual({
      ...bookmarkElement,
      description: 'Description',
    });
  });

  it('returns null if the line does not match', () => {
    const line = 'This is not a bookmark';

    const element = parseBookmarkElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(element).toBeNull();
  });

  it('does not match if the title is empty', () => {
    const line = '[](https://example.com)';

    const element = parseBookmarkElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(element).toBeNull();
  });

  it('does not match if the url is empty', () => {
    const line = '[Title]()';

    const element = parseBookmarkElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(element).toBeNull();
  });

  it('does not match if there is text before the link', () => {
    const line = 'Before [Title](https://example.com)';

    const element = parseBookmarkElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(element).toBeNull();
  });

  it('does not match if there is text after the link', () => {
    const line = '[Title](https://example.com) After';

    const element = parseBookmarkElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(element).toBeNull();
  });

  it('consumes the line', () => {
    const line = '[Title](https://example.com)';

    parseBookmarkElementFromMarkdown(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });
});
