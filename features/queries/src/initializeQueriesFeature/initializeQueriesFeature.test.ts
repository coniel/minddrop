import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Views } from '@minddrop/views';
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

  afterEach(async () => {
    removeEventListeners();
    await cleanup();
  });

  it('opens the queries view on open queries view event', () =>
    new Promise<void>((resolve) => {
      Events.addListener(Views.events.Open, 'test-open-queries', (data) => {
        // The queries view opens as a singleton
        expect(data.view).toBe(QueriesViewName);
        expect(data.id).toBe('queries:queries');
        resolve();
      });

      Events.dispatch(OpenQueriesViewEvent);
    }));

  it('opens the queries view showing the given query', () =>
    new Promise<void>((resolve) => {
      Events.addListener(Views.events.Open, 'test-open-query', (data) => {
        expect(data.subview).toEqual({ id: 'query_1' });
        resolve();
      });

      Events.dispatch(OpenQueriesViewEvent, { queryId: 'query_1' });
    }));
});
