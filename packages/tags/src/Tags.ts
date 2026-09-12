import { DefaultTagIcon, TagsIcon } from './constants';
import { TagNotFoundError } from './errors';
import {
  OpenTagsViewEvent,
  TagCreatedEvent,
  TagDeletedEvent,
  TagRenamedEvent,
  TagUpdatedEvent,
  TagsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: TagCreatedEvent,
  Updated: TagUpdatedEvent,
  Renamed: TagRenamedEvent,
  Deleted: TagDeletedEvent,
  Loaded: TagsLoadedEvent,
  OpenView: OpenTagsViewEvent,
} as const;

export const errors = {
  NotFound: TagNotFoundError,
};

export const constants = {
  Icon: TagsIcon,
  EntityDefaultIcon: DefaultTagIcon,
};

export { createTag as create } from './createTag';
export { deleteTag as delete } from './deleteTag';
export { getTag as get } from './getTag';
export { getTagByName as getByName } from './getTagByName';
export { getAllTags as getAll } from './getAllTags';
export { writeTag as write } from './writeTag';
export { readTag as read } from './readTag';
export {
  TagsStore as Store,
  useTag as use,
  useTags as useAll,
} from './TagsStore';
export { updateTag as update } from './updateTag';
export {
  searchTags as search,
  resolveUniqueTagName as resolveUniqueName,
  resolveNextTagColor as resolveNextColor,
} from './utils';
export { loadTags as load } from './loadTags';
export { loadWorkspaceTags as loadWorkspace } from './loadWorkspaceTags';
export { initializeTags as initialize } from './initializeTags';
