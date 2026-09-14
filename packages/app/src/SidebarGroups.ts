import { EntityGroups } from '@minddrop/entity-groups';
import {
  DatabasesSidebarGroupId,
  LibrarySidebarGroupId,
  SidebarGroupItemTypes,
  SidebarGroupsType,
} from './sidebar-groups';

export const constants = {
  Type: SidebarGroupsType,
  ItemTypes: SidebarGroupItemTypes,
  LibraryId: LibrarySidebarGroupId,
  DatabasesId: DatabasesSidebarGroupId,
};

// The entity groups API bound to the sidebar groups type
const facade = EntityGroups.createFacade(SidebarGroupsType);

export const {
  create,
  get,
  getAll,
  getForItem,
  isProtected,
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
const { delete: deleteSidebarGroup } = facade;

export { deleteSidebarGroup as delete };

export { initializeSidebarGroups as initialize } from './sidebar-groups';
