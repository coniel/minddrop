import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { OpenViewEvent } from '@minddrop/views';
import { CollectionsViewName, OpenCollectionsViewEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { initializeCollectionsFeature } from './initializeCollectionsFeature';

describe('initializeCollectionsFeature', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    setup();

    // Register the feature's event listeners
    removeEventListeners = initializeCollectionsFeature();
  });

  afterEach(() => {
    removeEventListeners();
    cleanup();
  });

  it('opens the collections view on open collections view event', () =>
    new Promise<void>((resolve) => {
      Events.addListener(OpenViewEvent, 'test-open-collections', (data) => {
        // The collections list view opens as a singleton
        expect(data.view).toBe(CollectionsViewName);
        expect(data.id).toBe('collections:collections');
        resolve();
      });

      Events.dispatch(OpenCollectionsViewEvent);
    }));
});
