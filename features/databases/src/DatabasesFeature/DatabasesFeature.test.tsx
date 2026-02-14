import { afterEach, describe, expect, it } from 'vitest';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { render } from '@minddrop/test-utils';
import {
  EventListenerId,
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
} from '../events';
import { cleanup } from '../test-utils';
import { DatabasesFeature } from './DatabasesFeature';

describe('DatabasesFeature', () => {
  afterEach(cleanup);

  it('opens database view on open database view event', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener<
        OpenMainContentViewEventData<OpenDatabaseViewEventData>
      >(OpenMainContentViewEvent, EventListenerId, ({ data }) => {
        expect(data.props!.databaseId).toBe('test-database');
        resolve();
      });

      Events.dispatch<OpenDatabaseViewEventData>(OpenDatabaseViewEvent, {
        databaseId: 'test-database',
      });
    }));
});
