import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  PersistentStore,
  useGlobalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { unarchiveRootTopics } from './unarchiveRootTopics';
import { useAppStore } from '../useAppStore';
import { cleanup, setup } from '../test-utils';
import { doesNotContain } from '@minddrop/utils';
import { addRootTopics } from '../addRootTopics';
import { archiveRootTopics } from '../archiveRootTopics';

const { tSailing, tAnchoring, tNavigation } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

describe('unarchiveRootTopics', () => {
  beforeEach(() => {
    setup();
    act(() => {
      addRootTopics(core, [tSailing.id, tAnchoring.id, tNavigation.id]);
      archiveRootTopics(core, [tSailing.id, tAnchoring.id, tNavigation.id]);
    });
  });

  afterEach(() => {
    cleanup();
    act(() => {
      PersistentStore.clearGlobalCache();
    });
  });

  it('removes archived topic IDs from the app store', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      unarchiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    expect(
      doesNotContain(result.current.archivedRootTopics, [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
  });

  it('removes archived topic IDs from the persistent store', () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'archivedRootTopics'),
    );

    act(() => {
      unarchiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    expect(
      doesNotContain(result.current, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it("dispatches a 'app:unarchive-root-topics' event", (done) => {
    function callback(payload) {
      expect(payload.data).toEqual({
        [tAnchoring.id]: tAnchoring,
        [tNavigation.id]: tNavigation,
      });
      done();
    }

    core.addEventListener('app:unarchive-root-topics', callback);

    act(() => {
      unarchiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });
  });
});
