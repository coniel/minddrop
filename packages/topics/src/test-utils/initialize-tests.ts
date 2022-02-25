import { initializeCore } from '@minddrop/core';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { act } from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { clearTopics } from '../clearTopics';
import { loadTopics } from '../loadTopics';
import { registerTopicView } from '../registerTopicView';
import { topics, topicViewConfigs, topicViewInstances } from './topics.data';

const { drops, dropTypeConfigs } = DROPS_TEST_DATA;

export const core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

export const setup = () => {
  act(() => {
    dropTypeConfigs.forEach((config) => {
      Drops.register(core, config);
    });
    Views.loadInstances(core, topicViewInstances);
    Drops.load(core, drops);
    loadTopics(core, topics);
    topicViewConfigs.forEach((config) => registerTopicView(core, config));
  });
};

export const cleanup = () => {
  act(() => {
    clearTopics(core);
    Views.clear(core);
    core.removeAllEventListeners();
    jest.clearAllMocks();
  });
};
