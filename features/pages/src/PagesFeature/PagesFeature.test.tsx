import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CloseViewEvent,
  CloseViewEventData,
  Events,
  OpenViewEvent,
  OpenViewEventData,
  UpdateViewEvent,
  UpdateViewEventData,
} from '@minddrop/events';
import { PageFixtures, Pages } from '@minddrop/pages';
import { render } from '@minddrop/test-utils';
import { PageViewProps } from '../PageView';
import {
  OpenPageViewEvent,
  OpenPageViewEventData,
  PageViewName,
} from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { PagesFeature } from './PagesFeature';

const { page_1 } = PageFixtures;

describe('<PagesFeature />', () => {
  beforeEach(() => {
    setup();

    // Load a page into the store and its file into the mock
    // file system so it can be deleted
    Pages.Store.load([page_1]);
    MockFs.addFiles(PageFixtures.pageFiles);
  });

  afterEach(cleanup);

  it('opens the page view on open page view event', () =>
    new Promise<void>((resolve) => {
      render(<PagesFeature />);

      Events.addListener<OpenViewEventData<PageViewProps>>(
        OpenViewEvent,
        'test-open-page',
        ({ data }) => {
          // The page view opens with the page's details
          expect(data.view).toBe(PageViewName);
          expect(data.id).toBe(`pages:page:${page_1.id}`);
          expect(data.props!.pageId).toBe(page_1.id);
          expect(data.title).toBe(page_1.name);
          expect(data.icon).toBe(page_1.icon);
          resolve();
        },
      );

      Events.dispatch<OpenPageViewEventData>(OpenPageViewEvent, {
        pageId: page_1.id,
      });
    }));

  it('updates the page view when the page is updated', () =>
    new Promise<void>((resolve) => {
      render(<PagesFeature />);

      Events.addListener<UpdateViewEventData>(
        UpdateViewEvent,
        'test-update-page',
        ({ data }) => {
          // The view title and icon follow the page
          expect(data.id).toBe(`pages:page:${page_1.id}`);
          expect(data.title).toBe('Renamed page');
          resolve();
        },
      );

      Pages.update(page_1.id, { name: 'Renamed page' });
    }));

  it('closes the page view when the page is deleted', () =>
    new Promise<void>((resolve) => {
      render(<PagesFeature />);

      Events.addListener<CloseViewEventData>(
        CloseViewEvent,
        'test-close-page',
        ({ data }) => {
          expect(data.id).toBe(`pages:page:${page_1.id}`);
          resolve();
        },
      );

      Pages.delete(page_1.id);
    }));
});
