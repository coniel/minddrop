import { Core } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { DropsResource } from '../DropsResource';

export function onRun(core: Core) {
  // Register the drops resource
  Resources.register(core, DropsResource);
}

export function onDisable(core: Core) {
  // Unregister the drops resource
  Resources.unregister(core, DropsResource);

  // Remove event listeners
  core.removeAllEventListeners();
}
