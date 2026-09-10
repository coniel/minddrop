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

export {
  initializeSidebarGroups as initialize,
  createSidebarGroup as create,
  getSidebarGroup as get,
  getAllSidebarGroups as getAll,
  getSidebarGroupsForItem as getForItem,
  isProtectedSidebarGroup as isProtected,
  updateSidebarGroup as update,
  deleteSidebarGroup as delete,
  reorderSidebarGroups as reorder,
  addSidebarGroupItem as addItem,
  moveSidebarGroupItem as moveItem,
  removeSidebarGroupItem as removeItem,
  reorderSidebarGroupItems as reorderItems,
  useSidebarGroup as use,
  useSidebarGroups as useAll,
  useSidebarGroupsForItem as useForItem,
} from './sidebar-groups';
