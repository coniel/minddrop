import { TagGroupsIcon } from './constants';
import { TagGroupNotFoundError } from './errors';
import {
  TagGroupCreatedEvent,
  TagGroupDeletedEvent,
  TagGroupUpdatedEvent,
  TagGroupsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: TagGroupCreatedEvent,
  Updated: TagGroupUpdatedEvent,
  Deleted: TagGroupDeletedEvent,
  Loaded: TagGroupsLoadedEvent,
} as const;

export const errors = {
  NotFound: TagGroupNotFoundError,
};

export const constants = {
  Icon: TagGroupsIcon,
};

export { createTagGroup as create } from './createTagGroup';
export { updateTagGroup as update } from './updateTagGroup';
export { deleteTagGroup as delete } from './deleteTagGroup';
export { getTagGroup as get } from './getTagGroup';
export { getAllTagGroups as getAll } from './getAllTagGroups';
export { getGroupTags as getTags } from './getGroupTags';
export { writeTagGroup as write } from './writeTagGroup';
export { readTagGroup as read } from './readTagGroup';
export { loadTagGroups as load } from './loadTagGroups';
export {
  TagGroupsStore as Store,
  useTagGroup as use,
  useTagGroups as useAll,
} from './TagGroupsStore';
