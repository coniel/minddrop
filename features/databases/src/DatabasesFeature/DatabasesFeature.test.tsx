import { afterEach, describe, expect, it } from 'vitest';
import {
  Events,
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

  it('sets activeDatabaseId when a database view is opened', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      // Listen for the main content event to know when the
      // dispatch chain has completed
      Events.addListener(OpenMainContentViewEvent, 'test-active-db', () => {
        expect(DatabasesFeatureState.get('activeDatabaseId')).toBe(
          'test-database',
        );
        resolve();
      });

      Events.dispatch<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
        databaseId: 'test-database',
      });
    }));

  it('clears activeDatabaseId when a non-database view is opened', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      // Set an active database first
      DatabasesFeatureState.set('activeDatabaseId', 'test-database');

      // Listen for the main content event to know when the
      // dispatch chain has completed
      Events.addListener(OpenMainContentViewEvent, 'test-clear-db', () => {
        expect(DatabasesFeatureState.get('activeDatabaseId')).toBeNull();
        resolve();
      });

      // Dispatch a non-database view
      Events.dispatch<OpenMainContentViewEventData>(OpenMainContentViewEvent, {
        view: 'some-other:view:name',
        component: () => null,
      });
    }));
});
