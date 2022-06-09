import { initializeCore } from '@minddrop/core';
import { GlobalPersistentStore } from '@minddrop/persistent-store';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { addRootTopics } from './addRootTopics';
import { useAppStore } from '../useAppStore';
import { cleanup, setup } from '../test-utils';
import { contains } from '@minddrop/utils';

const { tSailing, tAnchoring, tNavigation } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

describe('addRootTopics', () => {
  beforeEach(() => {
    setup();

    // Set a test root topic
    GlobalPersistentStore.set(core, 'rootTopics', [tSailing.id]);
  });

  afterEach(cleanup);

  it('adds topic IDs to the app store', () => {
    // Add a couple of root topics
    addRootTopics(core, [tAnchoring.id, tNavigation.id]);

    // Root topics should be in the app store
    expect(
      contains(useAppStore.getState().rootTopics, [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
  });

  it('adds topic IDs to the persistent store', () => {
    // Add a couple of root topics
    addRootTopics(core, [tAnchoring.id, tNavigation.id]);

    // Root topics should be in the persistent store
    expect(GlobalPersistentStore.get(core, 'rootTopics')).toEqual([
      tSailing.id,
      tAnchoring.id,
      tNavigation.id,
    ]);
  });

  it("dispatches a 'app:root-topics:add' event", (done) => {
    core.addEventListener('app:root-topics:add', (payload) => {
      // Get updated topic
      const topics = Topics.get([tAnchoring.id, tNavigation.id]);

      // Payload data should be updated topics
      expect(payload.data).toEqual(topics);
      done();
    });

    addRootTopics(core, [tAnchoring.id, tNavigation.id]);
  });
});
