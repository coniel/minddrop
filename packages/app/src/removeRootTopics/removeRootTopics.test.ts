import { initializeCore } from '@minddrop/core';
import { GlobalPersistentStore } from '@minddrop/persistent-store';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { removeRootTopics } from './removeRootTopics';
import { useAppStore } from '../useAppStore';
import { cleanup, setup } from '../test-utils';
import { doesNotContain } from '@minddrop/utils';
import { addRootTopics } from '../addRootTopics';

const { tSailing, tAnchoring, tNavigation } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

describe('removeRootTopics', () => {
  beforeEach(() => {
    setup();
    addRootTopics(core, [tSailing.id, tAnchoring.id, tNavigation.id]);
  });

  afterEach(cleanup);

  it('removes topic IDs from the app store', () => {
    removeRootTopics(core, [tAnchoring.id, tNavigation.id]);

    expect(
      doesNotContain(useAppStore.getState().rootTopics, [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
  });

  it('removes topic IDs from the persistent store', () => {
    removeRootTopics(core, [tAnchoring.id, tNavigation.id]);

    expect(
      doesNotContain(GlobalPersistentStore.get(core, 'rootTopics'), [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
  });

  it("dispatches a 'app:root-topics:remove' event", (done) => {
    core.addEventListener('app:root-topics:remove', (payload) => {
      // Get updated topic
      const topics = Topics.get([tAnchoring.id, tNavigation.id]);

      // Payload data should be updated topics
      expect(payload.data).toEqual(topics);

      done();
    });

    removeRootTopics(core, [tAnchoring.id, tNavigation.id]);
  });
});
