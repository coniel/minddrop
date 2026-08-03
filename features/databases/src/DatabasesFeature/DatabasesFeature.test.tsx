import { afterEach, describe, expect, it } from 'vitest';
import {
  Events,
  OpenViewEvent,
  OpenViewEventData,
  ViewAreaChangedEvent,
  ViewAreaChangedEventData,
} from '@minddrop/events';
import { render } from '@minddrop/test-utils';
import { DatabasesFeatureState } from '../DatabasesFeatureState';
import {
  DatabaseViewName,
  EventListenerId,
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

      Events.addListener<OpenViewEventData<OpenDatabaseViewEventData>>(
        OpenViewEvent,
        EventListenerId,
        ({ data }) => {
          // Should include the database view name
          expect(data.view).toBe(DatabaseViewName);
          expect(data.props!.databaseId).toBe('test-database');
          resolve();
        },
      );

      Events.dispatch<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
        databaseId: 'test-database',
      });
    }));

  it('sets activeDatabaseId when a database view is shown', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(ViewAreaChangedEvent, 'test-active-db', () => {
        expect(DatabasesFeatureState.get('activeDatabaseId')).toBe(
          'test-database',
        );
        resolve();
      });

      Events.dispatch<ViewAreaChangedEventData>(ViewAreaChangedEvent, {
        viewAreaId: 'main',
        main: {
          view: DatabaseViewName,
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

      Events.addListener(ViewAreaChangedEvent, 'test-clear-db', () => {
        expect(DatabasesFeatureState.get('activeDatabaseId')).toBeNull();
        resolve();
      });

      // Show a non-database view
      Events.dispatch<ViewAreaChangedEventData>(ViewAreaChangedEvent, {
        viewAreaId: 'main',
        main: { view: 'some-other:view:name' },
        split: null,
        splitRatio: 50,
      });
    }));
});
