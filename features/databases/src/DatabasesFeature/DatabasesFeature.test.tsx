import { afterEach, describe, expect, it } from 'vitest';
import {
  Events,
  MainContentChangedEvent,
  MainContentChangedEventData,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { render } from '@minddrop/test-utils';
import { DatabasesFeatureState } from '../DatabasesFeatureState';
import {
  EventListenerId,
  MainDatabaseViewName,
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
} from '../events';
import { cleanup } from '../test-utils';
import { DatabasesFeature } from './DatabasesFeature';

describe('DatabasesFeature', () => {
  afterEach(() => {
    cleanup();
    DatabasesFeatureState.reset();
  });

  it('opens database view on open database view event', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener<
        OpenMainContentViewEventData<OpenDatabaseViewEventData>
      >(OpenMainContentViewEvent, EventListenerId, ({ data }) => {
        // Should include the database view name
        expect(data.view).toBe(MainDatabaseViewName);
        expect(data.props!.databaseId).toBe('test-database');
        resolve();
      });

      Events.dispatch<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
        databaseId: 'test-database',
      });
    }));

  it('sets activeDatabaseId when a database view is shown', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(MainContentChangedEvent, 'test-active-db', () => {
        expect(DatabasesFeatureState.get('activeDatabaseId')).toBe(
          'test-database',
        );
        resolve();
      });

      Events.dispatch<MainContentChangedEventData>(MainContentChangedEvent, {
        main: {
          view: MainDatabaseViewName,
          props: { databaseId: 'test-database' },
        },
        split: null,
        splitRatio: 50,
      });
    }));

  it('clears activeDatabaseId when a non-database view is shown', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      // Set an active database first
      DatabasesFeatureState.set('activeDatabaseId', 'test-database');

      Events.addListener(MainContentChangedEvent, 'test-clear-db', () => {
        expect(DatabasesFeatureState.get('activeDatabaseId')).toBeNull();
        resolve();
      });

      // Show a non-database view
      Events.dispatch<MainContentChangedEventData>(MainContentChangedEvent, {
        main: { view: 'some-other:view:name' },
        split: null,
        splitRatio: 50,
      });
    }));
});
