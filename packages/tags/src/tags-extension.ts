import { Core } from '@minddrop/core';
import { TagsStore } from './TagsStore';
import { Tag } from './types';

export function onRun(core: Core) {
  // Register the tags:tag resource
  core.registerResource<Tag>({
    type: 'tags:tag',
    createEvent: 'tags:create',
    updateEvent: 'tags:update',
    deleteEvent: 'tags:delete',
    onLoad: (tags) => TagsStore.load(tags),
    onChange: (tag, deleted) => {
      if (deleted) {
        TagsStore.remove(tag.id);
      } else {
        TagsStore.set(tag);
      }
    },
  });
}

export function onDisable(core: Core) {
  // Clear the store
  TagsStore.clear();
  // Remove event listeners
  core.removeAllEventListeners();
}
