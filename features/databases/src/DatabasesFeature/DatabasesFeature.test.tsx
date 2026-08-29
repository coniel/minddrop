import { afterEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { render } from '@minddrop/test-utils';
import { OpenViewEvent } from '@minddrop/views';
import {
  DatabaseViewName,
  EventListenerId,
  OpenDatabaseViewEvent,
} from '../events';
import { cleanup } from '../test-utils';
import { DatabasesFeature } from './DatabasesFeature';

describe('DatabasesFeature', () => {
  afterEach(() => {
    cleanup();
  });

  it('opens database view on open database view event', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(OpenViewEvent, EventListenerId, ({ data }) => {
        // Should include the database view name
        expect(data.view).toBe(DatabaseViewName);
        expect(data.props!.databaseId).toBe('test-database');
        resolve();
      });

      Events.dispatch(OpenDatabaseViewEvent, {
        databaseId: 'test-database',
      });
    }));
});
