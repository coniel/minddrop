import { Core } from '@minddrop/core';
import { Tag } from '../types';
import { useTagsStore } from '../useTagsStore';

export function onRun(core: Core) {
  // Register the tags:tag resource
  core.registerResource<Tag>({
    type: 'tags:tag',
    createEvent: 'tags:create',
    updateEvent: 'tags:update',
    deleteEvent: 'tags:delete',
    onLoad: (tags) => useTagsStore.getState().loadTags(tags),
    onChange: (tag, deleted) => {
      const store = useTagsStore.getState();
      if (deleted) {
        store.removeTag(tag.id);
      } else {
        store.loadTags([tag]);
      }
    },
  });
}

export function onDisable(core: Core) {
  // Clear the store
  useTagsStore.getState().clear();
  // Remove event listeners
  core.removeAllEventListeners();
}
