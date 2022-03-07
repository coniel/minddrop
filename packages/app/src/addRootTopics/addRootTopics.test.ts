import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  PersistentStore,
  useGlobalPersistentStoreValue,
} from '@minddrop/persistent-store';
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
    act(() => {
      PersistentStore.setGlobalValue(core, 'rootTopics', [tSailing.id]);
    });
  });

  afterEach(() => {
    cleanup();
    act(() => {
      PersistentStore.clearGlobalCache();
    });
  });

  it('adds topic IDs to the app store', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      addRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    expect(
      contains(result.current.rootTopics, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it('adds topic IDs to the persistent store', () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'rootTopics'),
    );

    act(() => {
      addRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    expect(result.current).toEqual([
      tSailing.id,
      tAnchoring.id,
      tNavigation.id,
    ]);
  });

  it('adds app as parent to the topic', () => {
    // Add root topic
    addRootTopics(core, [tAnchoring.id]);

    // Get the updated topic
    const topic = Topics.get(tAnchoring.id);

    // Should have app as parent
    expect(contains(topic.parents, [{ type: 'app', id: 'root' }])).toBeTruthy();
  });

  it("dispatches a 'app:add-root-topics' event", (done) => {
    function callback(payload) {
      // Get updated topic
      const topics = Topics.get([tAnchoring.id, tNavigation.id]);

      // Payload data should be updated topics
      expect(payload.data).toEqual(topics);
      done();
    }

    core.addEventListener('app:add-root-topics', callback);

    act(() => {
      addRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });
  });
});
