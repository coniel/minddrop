import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { Topics } from '../Topics';
import { view, topics } from './topics.data';

export const core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

export const setup = () => {
  act(() => {
    Views.register(core, view);
    Topics.load(core, topics);
  });
};

export const cleanup = () => {
  act(() => {
    Topics.clear(core);
    Views.clear(core);
    core.removeAllEventListeners();
  });
};
