import { initializeCore } from '@minddrop/core';
import { Topics } from '@minddrop/topics';
import { Extension } from './topic-view-columns-extension';

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop/topic-view-columns',
});

describe('topic view columns extension', () => {
  it('registers the `minddrop:topic-view:column` view', () => {
    // Run the extension
    Extension.onRun(core);

    // View should be registered
    expect(Topics.getViewConfig('minddrop:topic-view:columns')).toBeDefined();
  });
});
