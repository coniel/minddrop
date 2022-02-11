import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { Topics } from '../Topics';
import { topics, topicViewConfigs, topicViewInstances } from './topics.data';

export const core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

export const setup = () => {
  act(() => {
    Topics.load(core, topics);
    Views.loadInstances(core, topicViewInstances);
    topicViewConfigs.forEach((config) => Topics.registerView(core, config));
  });
};

export const cleanup = () => {
  act(() => {
    Topics.clear(core);
    Views.clear(core);
    core.removeAllEventListeners();
  });
};
