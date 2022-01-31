import { initializeCore } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { act, renderHook } from '@minddrop/test-utils';
import { Topic, Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';
import { openTopicView } from './openTopicView';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('openTopicView', () => {
  afterEach(() => {
    act(() => {
      PersistentStore.clearLocalCache();
      useAppStore.getState().clear();
      Topics.clear(core);
    });
  });

  it('opens the view of the given topic', () => {
    const { result } = renderHook(() => useAppStore((state) => state));
    let topic: Topic;

    act(() => {
      topic = Topics.create(core, { title: 'My topic' });
      openTopicView(core, topic.id);
    });

    expect(result.current.view).toEqual({
      id: 'topic',
      title: topic.title,
      resource: {
        type: 'topic',
        id: topic.id,
      },
    });
  });
});
