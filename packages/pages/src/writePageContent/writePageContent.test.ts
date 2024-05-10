import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { cleanup, page1, setup } from '../test-utils';
import { PagesStore } from '../PagesStore';
import { serializePageMetadata, getPageMetadata } from '../utils';
import { PageNotFoundError } from '../errors';
import { writePageContent } from './writePageContent';

const PAGE_PATH = page1.path;
const SERIALIZED_METADATA = serializePageMetadata(getPageMetadata(page1));
const NEW_PAGE_CONTENT = '# Title\n\nNew content';

const MockFs = initializeMockFileSystem([
  // Page file
  {
    path: PAGE_PATH,
    textContent: `${SERIALIZED_METADATA}# Title\n\nOld content`,
  },
]);

describe('writePageContent', () => {
  beforeEach(() => {
    setup();

    // Load a page into the store
    PagesStore.getState().add(page1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the page does not exist', () => {
    // Attempt to write a page that does no exist. Should throw
    // a PageNotFoundError.
    expect(() => writePageContent('missing', '')).rejects.toThrowError(
      PageNotFoundError,
    );
  });

  it('writes the page content to the page file', async () => {
    // Wite the page
    await writePageContent(PAGE_PATH, NEW_PAGE_CONTENT);

    // Should write content to file
    expect(MockFs.readTextFile(PAGE_PATH)).toBe(
      `${SERIALIZED_METADATA}${NEW_PAGE_CONTENT}`,
    );
  });
});
