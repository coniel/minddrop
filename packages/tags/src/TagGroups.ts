import { EntityGroups } from '@minddrop/entity-groups';
import { TagGroupsIcon, TagGroupsType } from './constants';

// Tag groups are entity groups, so their events and errors are the
// generic ones: a listener filters on the group's type.
export const events: typeof EntityGroups.events = EntityGroups.events;

export const errors: typeof EntityGroups.errors = EntityGroups.errors;

export const constants = {
  Type: TagGroupsType,
  Icon: TagGroupsIcon,
};

// The entity groups API bound to the tag groups type
const facade = EntityGroups.createFacade(TagGroupsType);

export const {
  create,
  get,
  getAll,
  getForItem,
  update,
  reorder,
  addItem,
  moveItem,
  removeItem,
  reorderItems,
  use,
  useAll,
  useForItem,
} = facade;

// A reserved word cannot be destructured into a binding of its own
// name, so the deletion is exported by renaming.
const { delete: deleteTagGroup } = facade;

export { deleteTagGroup as delete };

export { getGroupTags as getTags, useGroupTags as useTags } from './tag-groups';
