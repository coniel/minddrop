import { onDisable, onRun } from './extensions-extension';
import { cleanup, core, topicExtensionConfig } from '../test-utils';
import { Resources } from '@minddrop/resources';
import { registerExtension } from '../registerExtension';
import { ExtensionConfigsStore } from '../ExtensionConfigsStore';

describe('extensions extension', () => {
  afterEach(cleanup);

  describe('onRun', () => {
    it('registers the `extensions:document` resource', () => {
      // Run the extension
      onRun(core);

      // Resource should be registered
      expect(Resources.get('extensions:document')).toBeDefined();
    });
  });

  describe('onDisable', () => {
    it('clears the configs store', () => {
      // Register an extension
      registerExtension(core, topicExtensionConfig);

      // Disable the extension
      onDisable(core);

      // Configs store should be cleared
      expect(ExtensionConfigsStore.getAll()).toEqual([]);
    });

    it('unregisters the extenion documents resource', () => {
      // Run the extension
      onRun(core);

      // Disable the extension
      onDisable(core);

      // Resource should no longer be registered
      expect(Resources.get('extensions:document')).toBeUndefined();
    });
  });
});
