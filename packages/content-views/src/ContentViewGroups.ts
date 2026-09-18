import { EntityGroups } from '@minddrop/entity-groups';
import { ContentViewGroupsType } from './constants';

// ContentView groups are entity groups, so their events and errors are
// the generic ones. A listener filters on the group's type.
export const events: typeof EntityGroups.events = EntityGroups.events;

export const errors: typeof EntityGroups.errors = EntityGroups.errors;

export const constants = {
  Type: ContentViewGroupsType,
  Icon: EntityGroups.constants.Icon,
};

// The entity groups API bound to the content view groups type
const facade = EntityGroups.createFacade(ContentViewGroupsType);

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
const { delete: deleteContentViewGroup } = facade;

export { deleteContentViewGroup as delete };
