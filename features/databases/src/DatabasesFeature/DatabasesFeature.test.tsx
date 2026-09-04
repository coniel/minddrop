import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { render } from '@minddrop/test-utils';
import { OpenViewEvent } from '@minddrop/views';
import {
  DatabaseViewName,
  EventListenerId,
  OpenDatabaseViewEvent,
} from '../events';
import { cleanup, setup } from '../test-utils';
import { DatabasesFeature } from './DatabasesFeature';

const { objectDatabase } = DatabaseFixtures;

describe('DatabasesFeature', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens database view on open database view event', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(OpenViewEvent, EventListenerId, (data) => {
        // Should include the database view name
        expect(data.view).toBe(DatabaseViewName);
        expect(data.props!.databaseId).toBe(objectDatabase.id);
        resolve();
      });

      Events.dispatch(OpenDatabaseViewEvent, {
        databaseId: objectDatabase.id,
      });
    }));
});
