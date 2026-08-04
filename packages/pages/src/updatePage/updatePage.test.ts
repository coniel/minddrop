import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { PagesStore } from '../PagesStore';
import { PageUpdatedEvent, PageUpdatedEventData } from '../events';
import {
  MockFs,
  boundPageLayout,
  cleanup,
  mockDate,
  page_1,
  setup,
} from '../test-utils';
import { Page } from '../types';
import { getPageFilePath } from '../utils';
import { updatePage } from './updatePage';

const { layout_page_1 } = DesignFixtures;

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

  it('drops property values not bound in the layout', async () => {
    // Set a value for a property bound in the layout and one
    // for a property that does not appear in it
    const page = await updatePage(page_1.id, {
      layout: boundPageLayout.id,
      properties: { title: 'Media', rating: 5 },
    });

    expect(page.properties).toEqual({ title: 'Media' });
  });

  it('prunes existing property values when the layout changes', async () => {
    // Set a value for a property bound in the layout
    await updatePage(page_1.id, {
      layout: boundPageLayout.id,
      properties: { title: 'Media' },
    });

    // Update the layout to one with no bound properties
    await updatePage(page_1.id, { layout: layout_page_1.id });

    expect(PagesStore.get(page_1.id)?.properties).toEqual({});
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
