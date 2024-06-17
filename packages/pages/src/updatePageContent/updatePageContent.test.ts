import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { cleanup, page1, setup } from '../test-utils';
import { PagesStore } from '../PagesStore';
import { serializePageMetadata, getPageMetadata } from '../utils';
import { PageNotFoundError } from '../errors';
import { updatePageContent } from './updatePageContent';
import { getPage } from '../getPage';
import { Events } from '@minddrop/events';

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

describe('updatePageContent', () => {
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
    expect(() => updatePageContent('missing', '')).rejects.toThrowError(
      PageNotFoundError,
    );
  });

  it('updates the page content in the store', async () => {
    // Wite the page
    await updatePageContent(PAGE_PATH, NEW_PAGE_CONTENT);

    // Should update the page content in the store
    expect(getPage(PAGE_PATH)?.contentRaw).toBe(NEW_PAGE_CONTENT);
  });

  it('writes the page content to the page file', async () => {
    // Update the page content
    await updatePageContent(PAGE_PATH, NEW_PAGE_CONTENT);

    // Should write content to file
    expect(MockFs.readTextFile(PAGE_PATH)).toBe(
      `${SERIALIZED_METADATA}${NEW_PAGE_CONTENT}`,
    );
  });

  it('dispatches a "pages:page:update-content" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'pages:page:update-content' events
      Events.addListener('pages:page:update-content', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual(PAGE_PATH);
        done();
      });

      // Update the page content
      updatePageContent(PAGE_PATH, NEW_PAGE_CONTENT);
    }));
});
