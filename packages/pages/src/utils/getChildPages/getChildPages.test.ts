import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, page1 } from '../../test-utils';
import { getPageChildren } from './getChildPages';
import { Page } from '../../types';

const PAGES: Page[] = [
  { ...page1, path: 'path/to/Page 1/Page 1.md' },
  { ...page1, path: 'path/to/Page 1/Page 2.md' },
  { ...page1, path: 'path/to/Page 1/Page 3/Page 3.md' },
  { ...page1, path: 'path/to/Page 1/Page 3/Page 4.md' },
  { ...page1, path: 'path/to/Page 5.md' },
];

describe('getPageChildren', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the children of a page', () => {
    expect(getPageChildren(PAGES[0].path, PAGES)).toEqual([PAGES[1], PAGES[2]]);
  });

  it('returns empty array if page has no children', () => {
    expect(getPageChildren(PAGES[4].path, PAGES)).toEqual([]);
  });

  it('returns the children of a directory', () => {
    expect(getPageChildren('path/to', PAGES)).toEqual([PAGES[0], PAGES[4]]);
  });
});
