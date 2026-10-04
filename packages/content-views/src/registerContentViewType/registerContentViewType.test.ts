import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewTypeRegisteredEvent } from '../events';
import { cleanup, contentViewType_gallery, setup } from '../test-utils';
import { registerContentViewType } from './registerContentViewType';

describe('registerContentViewType', () => {
  beforeEach(() => setup({ loadViewTypes: false }));

  afterEach(cleanup);

  it('registers the view type', () => {
    registerContentViewType(contentViewType_gallery);

    expect(ContentViewTypesRegistry.store).toHaveItem(
      contentViewType_gallery.type,
      contentViewType_gallery,
    );
  });

  it('registers the view type translations', () => {
    registerContentViewType({
      ...contentViewType_gallery,
      locales: { 'en-GB': { test: { viewType: 'Test view' } } },
    });

    expect(i18n.getResource('en-GB', 'core', 'test.viewType')).toBe(
      'Test view',
    );
  });

  it('dispatches the view type registered event', () =>
    new Promise<void>((done) => {
      Events.addListener(ContentViewTypeRegisteredEvent, 'test', (payload) => {
        expect(payload).toEqual(contentViewType_gallery);
        done();
      });

      registerContentViewType(contentViewType_gallery);
    }));
});
