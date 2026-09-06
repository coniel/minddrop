import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { render } from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { DatabaseViewName, EventListenerId } from '../events';
import { cleanup, setup } from '../test-utils';
import { DatabasesFeature } from './DatabasesFeature';

const { objectDatabase } = DatabaseFixtures;

describe('DatabasesFeature', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens database view on open database view event', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(Views.events.Open, EventListenerId, (data) => {
        // Should include the database view name
        expect(data.view).toBe(DatabaseViewName);
        expect(data.props!.databaseId).toBe(objectDatabase.id);
        resolve();
      });

      Events.dispatch(Databases.events.OpenView, {
        databaseId: objectDatabase.id,
      });
    }));
});
