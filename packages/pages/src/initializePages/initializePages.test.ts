import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PagesStore } from '../PagesStore';
import { PagesLoadedEvent } from '../events';
import { MockFs, cleanup, pages, setup } from '../test-utils';
import { getPageFilePath, getPagesDirPath } from '../utils';
import { initializePages } from './initializePages';

describe('initializePages', () => {
  beforeEach(() => setup({ loadPages: false }));

  afterEach(cleanup);

  it('creates the pages directory if it does not exist', async () => {
    // Remove the pages directory
    MockFs.removeFile(getPagesDirPath());

    await initializePages();

    expect(MockFs.exists(getPagesDirPath())).toBe(true);
  });

  it('loads pages from the pages directory into the store', async () => {
    await initializePages();

    expect(PagesStore.getAllArray()).toEqual(pages);
  });

  it('filters out null pages', async () => {
    // Create an invalid page file
    MockFs.writeTextFile(getPageFilePath('invalid-page'), 'invalid json');

    await initializePages();

    expect(PagesStore.getAllArray()).toEqual(pages);
  });

  it('dispatches a pages loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(PagesLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(pages);
        done();
      });

      initializePages();
    }));
});
