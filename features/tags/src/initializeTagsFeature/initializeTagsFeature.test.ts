import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { OpenTagsViewEvent } from '@minddrop/tags';
import { OpenViewEvent } from '@minddrop/views';
import { TagsViewName } from '../events';
import { cleanup, setup } from '../test-utils';
import { initializeTagsFeature } from './initializeTagsFeature';

describe('initializeTagsFeature', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    setup();

    // Register the feature's event listeners
    removeEventListeners = initializeTagsFeature();
  });

  afterEach(() => {
    removeEventListeners();
    cleanup();
  });

  it('opens the tags view on open tags view event', () =>
    new Promise<void>((resolve) => {
      Events.addListener(OpenViewEvent, 'test-open-tags', (data) => {
        // The tags list view opens as a singleton
        expect(data.view).toBe(TagsViewName);
        expect(data.id).toBe('tags:tags');
        resolve();
      });

      Events.dispatch(OpenTagsViewEvent);
    }));
});
