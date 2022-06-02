import { initializeCore } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { Extension } from './topic-view-columns-extension';

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop/topic-view-columns',
});

describe('topic view columns extension', () => {
  it('registers the minddrop/topic-view-columns view', () => {
    // Run the extension
    Extension.onRun(core);

    // View should be registered
    expect(Topics.getView('minddrop/topic-view-columns')).toBeDefined();
  });
});
