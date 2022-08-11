import { initializeCore } from '@minddrop/core';
import { GlobalPersistentStore } from '@minddrop/persistent-store';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { addRootTopics } from './addRootTopics';
import { useAppStore } from '../useAppStore';
import { cleanup, setup } from '../test-utils';
import { contains } from '@minddrop/utils';

const { tSailing, tAnchoring, tNavigation } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

describe('addRootTopics', () => {
  beforeEach(() => {
    setup();

    // Set a single root topic
    useAppStore.getState().setRootTopics([tSailing.id]);
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

  it('adds topic IDs at the specified index', () => {
    // Add a couple of root topics to the top
    // of the root topics list.
    addRootTopics(core, [tAnchoring.id, tNavigation.id], 0);

    // Root topics should be added at the specified index
    expect(GlobalPersistentStore.get(core, 'rootTopics')).toEqual([
      tAnchoring.id,
      tNavigation.id,
      tSailing.id,
    ]);
  });

  it('does not add topics already at the root level', () => {
    // Add a couple of root topics to the top
    // of the root topics list, including one
    // that is already present there.
    addRootTopics(core, [tAnchoring.id, tSailing.id], 0);

    // Root topics should be added at the specified index
    expect(GlobalPersistentStore.get(core, 'rootTopics')).toEqual([
      tAnchoring.id,
      tSailing.id,
    ]);
  });

  it("dispatches a 'app:root-topics:add' event", (done) => {
    core.addEventListener('app:root-topics:add', (payload) => {
      // Payload data should the added topic IDs
      expect(payload.data).toEqual([tAnchoring.id, tNavigation.id]);
      done();
    });

    addRootTopics(core, [tAnchoring.id, tNavigation.id]);
  });
});
