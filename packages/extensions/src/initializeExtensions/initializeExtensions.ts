import { Core, initializeCore } from '@minddrop/core';
import { getEnabledExtensions } from '../getEnabledExtensions';
import { registerExtension } from '../registerExtension';
import { ExtensionConfig } from '../types';

/**
 * Initializes the given extensions and runs
 * the enabled ones.
 *
 * @param core - A MindDrop core instance.
 * @param extensionConfigs - The extension configs to initialize.
 */
export function initializeExtensions(
  core: Core,
  extensionConfigs: ExtensionConfig[],
): void {
  extensionConfigs.forEach((config) => {
    // Register the extensions
    registerExtension(core, config);

    // Get enabled extensions
    const enabledExtensions = getEnabledExtensions();

    // Run the enabled extensions
    enabledExtensions.forEach((extension) => {
      // Create a core instance for the extension
      const extensionCore = initializeCore({
        appId: core.appId,
        extensionId: extension.id,
      });

      // Run the extension using its core instance
      extension.onRun(extensionCore);
    });
  });
}
