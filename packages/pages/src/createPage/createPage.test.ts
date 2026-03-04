import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DefaultContainerElementStyle } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { PagesStore } from '../PagesStore';
import { PageCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { getPageFilePath } from '../utils';
import { createPage } from './createPage';

const newPage = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  name: 'Untitled',
  tree: {
    id: 'root',
    type: 'root',
    style: DefaultContainerElementStyle,
    children: [],
  },
};

describe('createPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a page', async () => {
    const page = await createPage();

    expect(page).toEqual(newPage);
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
