import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DefaultPageLayout } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { PagesStore } from '../PagesStore';
import { DefaultPageIcon } from '../constants';
import { PageCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, pageLayout_1, setup } from '../test-utils';
import { getPageFilePath } from '../utils';
import { createPage } from './createPage';

const newPage = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  name: 'Untitled',
  icon: DefaultPageIcon,
  layout: {
    ...DefaultPageLayout,
    id: expect.any(String),
    name: 'Page',
    created: mockDate,
    lastModified: mockDate,
  },
};

describe('createPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a page', async () => {
    const page = await createPage();

    expect(page).toEqual(newPage);
  });

  it('uses the provided name', async () => {
    const page = await createPage({ name: 'My Page' });

    expect(page.name).toBe('My Page');
  });

  it('uses the provided icon', async () => {
    const page = await createPage({ icon: 'emoji:🎬:default' });

    expect(page.icon).toBe('emoji:🎬:default');
  });

  it('copies the provided layout with a fresh ID', async () => {
    const page = await createPage({ layout: pageLayout_1 });

    expect(page.layout).toEqual({
      ...pageLayout_1,
      id: expect.any(String),
      created: mockDate,
      lastModified: mockDate,
    });
    expect(page.layout.id).not.toBe(pageLayout_1.id);
  });

  it('adds the page to the store', async () => {
    const page = await createPage();

    expect(PagesStore.get(page.id)).toEqual(newPage);
  });

  it('writes the page config to the file system', async () => {
    const page = await createPage();

    expect(MockFs.readJsonFile(getPageFilePath(page.id))).toEqual(newPage);
  });

  it('dispatches the page created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(PageCreatedEvent, 'test-page-created', (payload) => {
        expect(payload.data).toEqual(newPage);
        done();
      });

      createPage();
    }));
});
