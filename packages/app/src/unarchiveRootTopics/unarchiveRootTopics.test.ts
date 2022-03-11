import { renderHook, act } from '@minddrop/test-utils';
import { useGlobalPersistentStore } from '@minddrop/persistent-store';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { unarchiveRootTopics } from './unarchiveRootTopics';
import { useAppStore } from '../useAppStore';
import { cleanup, core, setup } from '../test-utils';
import { contains, doesNotContain } from '@minddrop/utils';
import { addRootTopics } from '../addRootTopics';
import { archiveRootTopics } from '../archiveRootTopics';

const { tSailing, tAnchoring, tNavigation } = TOPICS_TEST_DATA;

describe('unarchiveRootTopics', () => {
  beforeEach(() => {
    setup();
    act(() => {
      // Add some root topics
      addRootTopics(core, [tSailing.id, tAnchoring.id, tNavigation.id]);
      // Archive added root topics
      archiveRootTopics(core, [tSailing.id, tAnchoring.id, tNavigation.id]);
    });
  });

  afterEach(cleanup);

  it('updates the app store archivedRootTopics and rootTopics', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      // Unarchive a couple of root topics
      unarchiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    // App store's archivedRootTopics should no longer contain the topic IDs
    expect(
      doesNotContain(result.current.archivedRootTopics, [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
    // App store's rootTopics should contain the topic IDs
    expect(
      contains(result.current.rootTopics, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it('updates the global persistent store archivedRootTopics and rootTopics', () => {
    const { result } = renderHook(() => useGlobalPersistentStore(core));

    act(() => {
      // Unarchive a couple of root topics
      unarchiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });

    // Global persistent store's archivedRootTopics should no longer contain the topic IDs
    expect(
      doesNotContain(result.current.archivedRootTopics, [
        tAnchoring.id,
        tNavigation.id,
      ]),
    ).toBeTruthy();
    // Global persistent store's rootTopics should contain the topic IDs
    expect(
      contains(result.current.rootTopics, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it("dispatches a 'app:unarchive-root-topics' event", (done) => {
    function callback(payload) {
      // Get the updated topics
      const topics = Topics.get([tAnchoring.id, tNavigation.id]);

      // Data payload should be updated topics
      expect(payload.data).toEqual(topics);
      done();
    }

    core.addEventListener('app:unarchive-root-topics', callback);

    act(() => {
      unarchiveRootTopics(core, [tAnchoring.id, tNavigation.id]);
    });
  });
});
