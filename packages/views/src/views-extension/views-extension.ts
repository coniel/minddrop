import { Core } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { ViewInstancesResource } from '../ViewInstancesResource';

export function onRun(core: Core) {
  // Register the 'views:view-instance' resource
  Resources.register(core, ViewInstancesResource);
}

export function onDisable(core: Core) {
  // Remove event listeners
  core.removeAllEventListeners();
}
