import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  PersistentStore,
  useGlobalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { archiveRootTopics } from './archiveRootTopics';
import { useAppStore } from '../useAppStore';
import { cleanup, setup } from '../test-utils';
import { contains } from '@minddrop/utils';

const { tSailing, tAnchoring, tNavigation } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

describe('archiveRootTopics', () => {
  beforeEach(() => {
    setup();
    act(() => {
      PersistentStore.setGlobalValue(core, 'archivedRootTopics', [tSailing.id]);
    });
  });

  afterEach(() => {
    cleanup();
    act(() => {
      PersistentStore.clearGlobalCache();
    });
  });

  it('adds archived topic IDs to the app store', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      archiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

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
      archiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    expect(result.current).toEqual([
      tSailing.id,
      tAnchoring.id,
      tNavigation.id,
    ]);
  });

  it("dispatches a 'app:archive-root-topics' event", (done) => {
    function callback(payload) {
      expect(payload.data).toEqual({
        [tAnchoring.id]: tAnchoring,
        [tNavigation.id]: tNavigation,
      });
      done();
    }

    core.addEventListener('app:archive-root-topics', callback);

    act(() => {
      archiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });
  });
});
