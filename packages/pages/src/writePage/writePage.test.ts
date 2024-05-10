import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  initializeMockFileSystem,
  FileNotFoundError,
} from '@minddrop/file-system';
import { cleanup, page1, setup } from '../test-utils';
import { PagesStore } from '../PagesStore';
import { serializePageMetadata, getPageMetadata } from '../utils';
import { writePage } from './writePage';

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

describe('writePage', () => {
  beforeEach(() => {
    setup();

    // Load a workspace into the store
    PagesStore.getState().add(page1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the page file does not exist', () => {
    // Attempt to write a page missing its file. Should throw
    // a FileNotFoundError.
    expect(() => writePage('missing', '')).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('writes the page content to the page file', async () => {
    // Wite the page
    await writePage(PAGE_PATH, `${SERIALIZED_METADATA}${NEW_PAGE_CONTENT}`);

    // Should write content to file
    expect(MockFs.readTextFile(PAGE_PATH)).toBe(
      `${SERIALIZED_METADATA}${NEW_PAGE_CONTENT}`,
    );
  });
});
