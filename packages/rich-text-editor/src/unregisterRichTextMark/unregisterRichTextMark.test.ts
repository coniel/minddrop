import { boldMarkConfig } from '../default-mark-configs';
import { RTMarkConfigsStore } from '../RTMarkConfigsStore';
import { core } from '../test-utils';
import { unregisterRichTextMark } from './unregisterRichTextMark';

describe('unregisterRichTextMark', () => {
  beforeEach(() => {
    // Register the 'bold' mark
    RTMarkConfigsStore.register(boldMarkConfig);
  });

  afterEach(() => {
    // Clear all event listeners
    core.removeAllEventListeners();
  });

  it('unregisters the mark config', () => {
    // Unregister a mark
    unregisterRichTextMark(core, boldMarkConfig.key);

    // The mark should no longer be registered
    expect(RTMarkConfigsStore.get(boldMarkConfig.key)).toBeUndefined();
  });

  it('dispatches a `rich-text-mark:unregister` event', (done) => {
    // Listen to 'rich-text-mark:unregister' events
    core.addEventListener('rich-text-mark:unregister', (payload) => {
      // Should have the config as the payload data
      expect(payload.data).toEqual(boldMarkConfig);
      done();
    });

    // Unregister a mark
    unregisterRichTextMark(core, boldMarkConfig.key);
  });

  it('does nothing if the config is not registerd', () => {
    // Attempt to unregister a mark that is not registered.
    // Should not throw.
    expect(() => unregisterRichTextMark(core, 'foo')).not.toThrow();
  });
});
