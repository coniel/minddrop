import { Resources } from '@minddrop/resources';
import { Core } from '@minddrop/core';
import { TagsResource } from './TagsResource';

export function onRun(core: Core) {
  // Register the tags:tag resource
  Resources.register(core, TagsResource);
}

export function onDisable(core: Core) {
  // Remove event listeners
  core.removeAllEventListeners();
}
