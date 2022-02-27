import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  PersistentStore,
  useGlobalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
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
    act(() => {
      addRootTopics(core, [tSailing.id, tAnchoring.id, tNavigation.id]);
    });
  });

  afterEach(() => {
    cleanup();
    act(() => {
      PersistentStore.clearGlobalCache();
    });
  });

  it('removes topic IDs from the app store', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      removeRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    expect(
      doesNotContain(result.current.rootTopics, [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
  });

  it('removes topic IDs from the persistent store', () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'rootTopics'),
    );

    act(() => {
      removeRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    expect(
      doesNotContain(result.current, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it("dispatches a 'app:remove-root-topics' event", (done) => {
    function callback(payload) {
      expect(payload.data).toEqual({
        [tAnchoring.id]: tAnchoring,
        [tNavigation.id]: tNavigation,
      });
      done();
    }

    core.addEventListener('app:remove-root-topics', callback);

    act(() => {
      removeRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });
  });
});
