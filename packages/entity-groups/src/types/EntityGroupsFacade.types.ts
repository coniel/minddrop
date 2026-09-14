import type { CreateEntityGroupOptions } from '../createEntityGroup';
import type { EntityGroup, UpdateEntityGroupData } from './EntityGroup.types';

/**
 * The entity groups API bound to one group type, so that a package
 * owning a type exposes it without threading the type through every
 * call.
 */
export interface EntityGroupsFacade {
  /**
   * Creates a new group, listing it at the given position among the
   * type's existing ones.
   *
   * @param name - The name of the group.
   * @param options - Options for the created group.
   * @returns The created group.
   *
   * @throws {InvalidParameterError} If the name is empty.
   * @throws {DuplicateEntityGroupNameError} If another group of the type has the name.
   * @throws {UnsupportedEntityGroupItemError} If an item is not of a type the group can hold.
   *
   * @dispatches entity-groups:group:created
   */
  create(
    name: string,
    options?: CreateEntityGroupOptions,
  ): Promise<EntityGroup>;

  /**
   * Retrieves a group by ID.
   *
   * @param id - The ID of the group.
   * @param throwOnNotFound - Whether to throw an error if the group is not found.
   * @returns The group.
   *
   * @throws {EntityGroupNotFoundError} If the group does not exist.
   */
  get(id: string): EntityGroup;
  get(id: string, throwOnNotFound: false): EntityGroup | null;

  /**
   * Retrieves the type's groups.
   *
   * @returns The groups in the order they are listed.
   */
  getAll(): EntityGroup[];

  /**
   * Retrieves the groups holding an item.
   *
   * @param itemId - The ID of the item.
   * @returns The groups holding the item, in the order they are listed.
   */
  getForItem(itemId: string): EntityGroup[];

  /**
   * Checks whether a group is one the app provides.
   *
   * @param id - The ID of the group.
   * @returns Whether the group is provided by the app.
   */
  isProtected(id: string): boolean;

  /**
   * Updates a group.
   *
   * @param id - The ID of the group to update.
   * @param data - The group data.
   * @returns The updated group.
   *
   * @throws {EntityGroupNotFoundError} If the group does not exist.
   * @throws {ProtectedEntityGroupError} If the group is one the app provides.
   * @throws {InvalidParameterError} If the name is empty.
   * @throws {DuplicateEntityGroupNameError} If another group of the type has the name.
   *
   * @dispatches entity-groups:group:updated
   */
  update(id: string, data: UpdateEntityGroupData): Promise<EntityGroup>;

  /**
   * Deletes a group. Its items become ungrouped, and the entities
   * they point to are left untouched.
   *
   * @param id - The ID of the group to delete.
   *
   * @throws {EntityGroupNotFoundError} If the group does not exist.
   * @throws {ProtectedEntityGroupError} If the group is one the app provides.
   *
   * @dispatches entity-groups:group:deleted
   */
  delete(id: string): Promise<void>;

  /**
   * Reorders the type's groups, listing them in the given ID order.
   * The groups the app provides are ordered among the user's own.
   *
   * @param ids - The group IDs in the desired order.
   * @returns The groups in their new order.
   *
   * @dispatches entity-groups:groups:reordered
   */
  reorder(ids: string[]): Promise<EntityGroup[]>;

  /**
   * Adds an item to a group. An item the group already holds is
   * moved to the new position.
   *
   * @param groupId - The ID of the group to add the item to.
   * @param itemId - The ID of the item to add.
   * @param index - The position to insert the item at, appending it when omitted.
   * @returns The updated group.
   *
   * @throws {EntityGroupNotFoundError} If the group does not exist.
   * @throws {ProtectedEntityGroupError} If the group is one the app provides.
   * @throws {UnsupportedEntityGroupItemError} If the item is not of a type the group can hold.
   *
   * @dispatches entity-groups:group:updated
   */
  addItem(
    groupId: string,
    itemId: string,
    index?: number,
  ): Promise<EntityGroup>;

  /**
   * Moves an item from one group to another, as a drag between them
   * does.
   *
   * @param fromGroupId - The ID of the group to move the item out of.
   * @param toGroupId - The ID of the group to move the item into.
   * @param itemId - The ID of the item to move.
   * @param index - The position to insert the item at, appending it when omitted.
   * @returns The updated target group.
   *
   * @throws {EntityGroupNotFoundError} If either group does not exist.
   * @throws {ProtectedEntityGroupError} If the target group is one the app provides.
   * @throws {UnsupportedEntityGroupItemError} If the item is not of a type the group can hold.
   *
   * @dispatches entity-groups:group:updated
   */
  moveItem(
    fromGroupId: string,
    toGroupId: string,
    itemId: string,
    index?: number,
  ): Promise<EntityGroup>;

  /**
   * Removes an item from a group, ungrouping it.
   *
   * @param groupId - The ID of the group to remove the item from.
   * @param itemId - The ID of the item to remove.
   * @returns The updated group.
   *
   * @throws {EntityGroupNotFoundError} If the group does not exist.
   * @throws {ProtectedEntityGroupError} If the group is one the app provides.
   *
   * @dispatches entity-groups:group:updated
   */
  removeItem(groupId: string, itemId: string): Promise<EntityGroup>;

  /**
   * Reorders a group's items, listing them in the given ID order.
   *
   * @param groupId - The ID of the group to reorder.
   * @param itemIds - The item IDs in the desired order.
   * @returns The updated group.
   *
   * @throws {EntityGroupNotFoundError} If the group does not exist.
   * @throws {ProtectedEntityGroupError} If the group is one the app provides.
   *
   * @dispatches entity-groups:group:updated
   */
  reorderItems(groupId: string, itemIds: string[]): Promise<EntityGroup>;

  /**
   * Retrieves a group by ID.
   *
   * @param id - The ID of the group to retrieve.
   * @returns The group, or null if it does not exist.
   */
  use(id: string): EntityGroup | null;

  /**
   * Retrieves the type's groups.
   *
   * @returns The groups in the order they are listed.
   */
  useAll(): EntityGroup[];

  /**
   * Retrieves the groups holding an item.
   *
   * @param itemId - The ID of the item.
   * @returns The groups holding the item, in the order they are listed.
   */
  useForItem(itemId: string): EntityGroup[];
}
