import { Core } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { ViewInstances } from '@minddrop/views';
import {
  TopicViewColumnsInstance,
  UpdateTopicViewColumnsInstanceData,
} from '../types';
import { removeItemsFromColumns } from '../removeItemsFromColumns';

/**
 * The view's onRemoveDrops callback.
 *
 * @param core A MindDrop core instance.
 * @param viewInstance The view instance.
 * @param drops The removed drops.
 */
export function onRemoveDrops(
  core: Core,
  viewInstance: TopicViewColumnsInstance,
  drops: DropMap,
): void {
  // Remove drops from columns
  const columns = removeItemsFromColumns(
    viewInstance.columns,
    Object.keys(drops),
  );

  // Update the view instance
  ViewInstances.update<UpdateTopicViewColumnsInstanceData>(
    core,
    viewInstance.id,
    {
      columns,
    },
  );
}
