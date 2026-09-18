import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { Events } from '@minddrop/events';
import { Views } from '@minddrop/views';
import {
  ContentViewViewName,
  NewContentViewViewId,
  NewContentViewViewName,
  OpenContentViewViewEvent,
  OpenNewContentViewViewEvent,
} from '../events';
import { cleanup, setup } from '../test-utils';
import { initializeContentViewsFeature } from './initializeContentViewsFeature';

const { contentView_gallery_1, contentViewGroup_1 } = ContentViewFixtures;

describe('initializeContentViewsFeature', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    setup();

    // Register the feature's event listeners
    removeEventListeners = initializeContentViewsFeature();
  });

  afterEach(async () => {
    removeEventListeners();
    await cleanup();
  });

  it('opens the content view view on open content view view event', () =>
    new Promise<void>((resolve) => {
      Events.addListener(
        Views.events.Open,
        'test-open-content-view',
        (data) => {
          // The content view view opens with the content view's details
          expect(data.view).toBe(ContentViewViewName);
          expect(data.id).toBe(
            `content-views:content-view:${contentView_gallery_1.id}`,
          );
          expect(data.props!.contentViewId).toBe(contentView_gallery_1.id);
          expect(data.title).toBe(contentView_gallery_1.name);
          expect(data.icon).toBe(contentView_gallery_1.icon);
          resolve();
        },
      );

      Events.dispatch(OpenContentViewViewEvent, {
        contentViewId: contentView_gallery_1.id,
      });
    }));

  it('opens the new content view view on open new content view view event', () =>
    new Promise<void>((resolve) => {
      Events.addListener(
        Views.events.Open,
        'test-open-new-content-view',
        (data) => {
          // The new content view view opens with the selected view type
          expect(data.view).toBe(NewContentViewViewName);
          expect(data.id).toBe(NewContentViewViewId);
          expect(data.props!.viewType).toBe(contentView_gallery_1.type);
          resolve();
        },
      );

      Events.dispatch(OpenNewContentViewViewEvent, {
        viewType: contentView_gallery_1.type,
      });
    }));

  it('opens the new content view view with the group to file the view under', () =>
    new Promise<void>((resolve) => {
      Events.addListener(
        Views.events.Open,
        'test-open-new-content-view-in-group',
        (data) => {
          expect(data.props!.groupId).toBe(contentViewGroup_1.id);
          resolve();
        },
      );

      Events.dispatch(OpenNewContentViewViewEvent, {
        viewType: contentView_gallery_1.type,
        groupId: contentViewGroup_1.id,
      });
    }));

  it('updates the content view view when the content view is updated', () =>
    new Promise<void>((resolve) => {
      Events.addListener(
        Views.events.Update,
        'test-update-content-view',
        (data) => {
          // The view title follows the content view
          expect(data.id).toBe(
            `content-views:content-view:${contentView_gallery_1.id}`,
          );
          expect(data.title).toBe('Renamed view');
          resolve();
        },
      );

      ContentViews.update(contentView_gallery_1.id, { name: 'Renamed view' });
    }));

  it('closes the content view view when the content view is deleted', () =>
    new Promise<void>((resolve) => {
      Events.addListener(
        Views.events.Close,
        'test-close-content-view',
        (data) => {
          expect(data.id).toBe(
            `content-views:content-view:${contentView_gallery_1.id}`,
          );
          resolve();
        },
      );

      ContentViews.delete(contentView_gallery_1.id);
    }));
});
