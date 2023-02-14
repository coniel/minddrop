import { boldMarkConfig, italicMarkConfig } from '../default-mark-configs';
import { RTMarkConfigsStore } from '../RTMarkConfigsStore';
import { core } from '../test-utils';
import { registerRichTextMark } from './registerRichTextMark';

describe('registerRichTextMark', () => {
  afterEach(() => {
    // Clear all registered marks
    RTMarkConfigsStore.clear();
    // Clear event listeners
    core.removeAllEventListeners();
  });

  describe('single config', () => {
    it('registers the config', () => {
      // Register a mark config
      registerRichTextMark(core, boldMarkConfig);

      // The mark should be registered
      expect(RTMarkConfigsStore.get(boldMarkConfig.key)).toEqual(
        boldMarkConfig,
      );
    });

    it('dispatches a `rich-text-mark:register` event', (done) => {
      // Listen to 'rich-text-mark:register' events
      core.addEventListener('rich-text-mark:register', (payload) => {
        // Should have the config as the payload data
        expect(payload.data).toEqual(boldMarkConfig);
        done();
      });

      // Register a mark config
      registerRichTextMark(core, boldMarkConfig);
    });
  });

  describe('multiple configs', () => {
    it('registers the configs', () => {
      // Register two mark configs
      registerRichTextMark(core, [boldMarkConfig, italicMarkConfig]);

      // The marks should be registered
      expect(RTMarkConfigsStore.getAll()).toEqual([
        boldMarkConfig,
        italicMarkConfig,
      ]);
    });

    it('dispatches a `rich-text-mark:register` event per config', (done) => {
      // Count the dispatches
      let count = 0;

      // Listen to 'rich-text-mark:register' events
      core.addEventListener('rich-text-mark:register', (payload) => {
        count += 1;

        if (count === 1) {
          // Should have the first config as the payload data
          expect(payload.data).toEqual(boldMarkConfig);
        } else {
          // Should have the second config as the payload data
          expect(payload.data).toEqual(italicMarkConfig);
          done();
        }
      });

      // Register two mark configs
      registerRichTextMark(core, [boldMarkConfig, italicMarkConfig]);
    });
  });
});
