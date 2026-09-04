import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { OpenViewEvent } from '@minddrop/views';
import { OpenQueriesViewEvent, QueriesViewName } from '../events';
import { cleanup, setup } from '../test-utils';
import { initializeQueriesFeature } from './initializeQueriesFeature';

describe('initializeQueriesFeature', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    setup();

    // Register the feature's event listeners
    removeEventListeners = initializeQueriesFeature();
  });

  afterEach(() => {
    removeEventListeners();
    cleanup();
  });

  it('opens the queries view on open queries view event', () =>
    new Promise<void>((resolve) => {
      Events.addListener(OpenViewEvent, 'test-open-queries', (data) => {
        // The queries view opens as a singleton
        expect(data.view).toBe(QueriesViewName);
        expect(data.id).toBe('queries:queries');
        resolve();
      });

      Events.dispatch(OpenQueriesViewEvent);
    }));
});
