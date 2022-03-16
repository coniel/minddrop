import { initializeCore } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import extension from './topic-view-columns-extension';

const core = initializeCore({
  appId: 'app-id',
  extensionId: 'minddrop/topic-view-columns',
});

describe('topic view columns extension', () => {
  it('registers the minddrop/topic-view-columns view', () => {
    // Run the extension
    extension.onRun(core);

    // View should be registered
    expect(Topics.getView('minddrop/topic-view-columns')).toBeDefined();
  });
});
