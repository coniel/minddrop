import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PagesStore } from '../PagesStore';
import { PageDeletedEvent } from '../events';
import { MockFs, cleanup, page_1, setup } from '../test-utils';
import { getPageFilePath } from '../utils';
import { deletePage } from './deletePage';

describe('deletePage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the page from the store', async () => {
    await deletePage(page_1.id);

    expect(PagesStore.get(page_1.id)).toBeNull();
  });

  it('deletes the page config from the file system', async () => {
    await deletePage(page_1.id);

    expect(MockFs.exists(getPageFilePath(page_1.id))).toBe(false);
  });

  it('dispatches the page deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(PageDeletedEvent, 'test-page-deleted', (payload) => {
        expect(payload.data).toEqual(page_1);
        done();
      });

      deletePage(page_1.id);
    }));
});
