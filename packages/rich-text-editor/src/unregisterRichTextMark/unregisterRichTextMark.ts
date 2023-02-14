import { Core } from '@minddrop/core';
import { RTMarkConfigsStore } from '../RTMarkConfigsStore';

/**
 * Unregisters a rich text mark config by key.
 * Dispatches a 'rich-text-mark:unregister' event.
 */
export function unregisterRichTextMark(core: Core, key: string): void {
  // Get the mark config
  const config = RTMarkConfigsStore.get(key);

  if (!config) {
    // Stop here if the config is not registered
    return;
  }

  // Unregister the mark
  RTMarkConfigsStore.unregister(config);

  // Dispatch a 'rich-text-mark:unregister' event
  core.dispatch('rich-text-mark:unregister', config);
}
