import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  PersistentStore,
  useGlobalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { Topic, Topics } from '@minddrop/topics';
import { addTopics } from './addTopics';

const core = initializeCore({ appId: 'app', extensionId: 'app' });

describe('addTopics', () => {
  let topic1: Topic;
  let topic2: Topic;
  let topic3: Topic;

  beforeAll(() => {
    act(() => {
      topic1 = Topics.create(core);
      topic2 = Topics.create(core);
      topic3 = Topics.create(core);
      PersistentStore.setGlobalValue(core, 'topics', [topic3.id]);
    });
  });

  afterAll(() => {
    Topics.clear(core);
    PersistentStore.clearGlobalCache();
  });

  it('adds topic IDs to the store', () => {
    const { result } = renderHook(() =>
      useGlobalPersistentStoreValue(core, 'topics'),
    );

    act(() => {
      addTopics(core, [topic1.id, topic2.id]);
    });

    expect(result.current).toEqual([topic3.id, topic1.id, topic2.id]);
  });

  it("dispatches a 'app:add-topics' event", (done) => {
    function callback(payload) {
      expect(payload.data).toEqual({
        [topic1.id]: topic1,
        [topic2.id]: topic2,
      });
      done();
    }

    core.addEventListener('app:add-topics', callback);

    act(() => {
      addTopics(core, [topic1.id, topic2.id]);
    });
  });
});