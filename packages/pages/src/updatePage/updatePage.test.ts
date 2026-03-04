import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PagesStore } from '../PagesStore';
import { PageUpdatedEvent, PageUpdatedEventData } from '../events';
import { MockFs, cleanup, mockDate, page_1, setup } from '../test-utils';
import { Page } from '../types';
import { getPageFilePath } from '../utils';
import { updatePage } from './updatePage';

const update = {
  name: 'Updated Page 1',
};
const updatedPage: Page = {
  ...page_1,
  ...update,
  lastModified: mockDate,
};

describe('updatePage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the page in the store', async () => {
    await updatePage(page_1.id, update);

    expect(PagesStore.get(page_1.id)).toEqual(updatedPage);
  });

  it('writes the page config to the file system', async () => {
    await updatePage(page_1.id, update);

    expect(MockFs.readJsonFile(getPageFilePath(page_1.id))).toEqual(
      updatedPage,
    );
  });

  it('returns the updated page', async () => {
    const page = await updatePage(page_1.id, update);

    expect(page).toEqual(updatedPage);
  });

  it('dispatches the page updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<PageUpdatedEventData>(
        PageUpdatedEvent,
        'test-page-updated',
        (payload) => {
          expect(payload.data.original).toEqual(page_1);
          expect(payload.data.updated).toEqual(updatedPage);
          done();
        },
      );

      updatePage(page_1.id, update);
    }));
});
