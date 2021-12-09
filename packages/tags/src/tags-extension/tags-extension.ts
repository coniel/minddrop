import { Core } from '@minddrop/core';
import { Tags } from '../Tags';
import { useTagsStore } from '../useTagsStore';

export function onRun(core: Core) {
  // Listen to tags:load events and load tags into the store
  Tags.addEventListener(core, 'tags:load', (payload) =>
    useTagsStore.getState().loadTags(payload.data),
  );

  // Listen to tags:clear events and clear the store
  Tags.addEventListener(core, 'tags:clear', useTagsStore.getState().clear);

  // Listen to tags:create events and add new tags to the store
  Tags.addEventListener(core, 'tags:create', (payload) =>
    useTagsStore.getState().addTag(payload.data),
  );

  // Listen to tags:update events and update tags in the store
  Tags.addEventListener(core, 'tags:update', (payload) =>
    useTagsStore
      .getState()
      .updateTag(payload.data.before.id, payload.data.changes),
  );

  // Listen to tags:delete events and remove tags from the store
  Tags.addEventListener(core, 'tags:delete', (payload) =>
    useTagsStore.getState().removeTag(payload.data.id),
  );
}

export function onDisable(core: Core) {
  // Clear the store
  useTagsStore.getState().clear();
  // Remove event listeners
  core.removeAllEventListeners();
}
