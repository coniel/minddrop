import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  PersistentStore,
  useGlobalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { contains, doesNotContain } from '@minddrop/utils';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { archiveRootTopics } from './archiveRootTopics';
import { useAppStore } from '../useAppStore';
import { addRootTopics } from '../addRootTopics';
import { cleanup, setup } from '../test-utils';

const { tSailing, tAnchoring, tNavigation } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

describe('archiveRootTopics', () => {
  beforeEach(() => {
    setup();
    act(() => {
      // Add a couple of topics as root topics
      addRootTopics(core, [tAnchoring.id, tNavigation.id]);
      // Add an archived root topic to the global store
      PersistentStore.setGlobalValue(core, 'archivedRootTopics', [tSailing.id]);
    });
  });

  afterEach(cleanup);

  it('adds archived topic IDs to the app store', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      // Archive two root topics
      archiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    // Topic IDs should be added to app store archivedRootTopics
    expect(
      contains(result.current.archivedRootTopics, [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
  });

  it('adds archived topic IDs to the persistent store', () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'archivedRootTopics'),
    );

    act(() => {
      // Archive two root topics
      archiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    // Topic IDs should be added to global persistent store archivedRootTopics
    expect(result.current).toEqual([
      tSailing.id,
      tAnchoring.id,
      tNavigation.id,
    ]);
  });

  it('removes root topic IDs from the app store', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      // Archive two root topics
      archiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    // App store rootTopics should no longer contain the topic IDs
    expect(
      doesNotContain(result.current.rootTopics, [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
  });

  it('reomves root topic IDs from the persistent store', () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'rootTopics'),
    );

    act(() => {
      // Archive two root topics
      archiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    // Global persistent store rootTopics should no longer contain the topic IDs
    expect(
      doesNotContain(result.current, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it("dispatches a 'app:archive-root-topics' event", (done) => {
    // Listen to 'app:archive-root-topics' events
    core.addEventListener('app:archive-root-topics', (payload) => {
      // Get updated topics
      const topics = Topics.get([tAnchoring.id, tNavigation.id]);

      // Payload data should be the topics
      expect(payload.data).toEqual(topics);
      done();
    });

    act(() => {
      // Archive two root topics
      archiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });
  });
});
