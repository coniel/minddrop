export interface ReorderEntityGroupItemsAction {
  action: 'reorder-items';

  /**
   * The ID of the group whose items are reordered.
   */
  groupId: string;

  /**
   * The group's item IDs in their new order.
   */
  itemIds: string[];
}

export interface MoveEntityGroupItemAction {
  action: 'move-item';

  /**
   * The ID of the group the item leaves.
   */
  fromGroupId: string;

  /**
   * The ID of the group the item joins.
   */
  toGroupId: string;

  /**
   * The ID of the item to move.
   */
  itemId: string;

  /**
   * The position the item takes in the target group's items.
   */
  index: number;
}

export interface AddEntityGroupItemAction {
  action: 'add-item';

  /**
   * The ID of the group the item is added to.
   */
  groupId: string;

  /**
   * The ID of the item to add.
   */
  itemId: string;

  /**
   * The position the item takes in the group's items.
   */
  index: number;
}

/**
 * A model call a drop on a group resolves to.
 */
export type EntityGroupDropAction =
  | ReorderEntityGroupItemsAction
  | MoveEntityGroupItemAction
  | AddEntityGroupItemAction;
