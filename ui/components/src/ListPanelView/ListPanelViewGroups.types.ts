import { EntityGroup } from '@minddrop/entity-groups';
import { EntityGroupAddAction } from '@minddrop/ui-entity-groups';

export interface ListPanelViewGroups {
  /**
   * The entity group type the listed items are grouped by.
   */
  type: string;

  /**
   * Returns the add control shown in a group's label row, or null
   * for groups which take no adding.
   */
  resolveAddAction?: (group: EntityGroup) => EntityGroupAddAction | null;
}
