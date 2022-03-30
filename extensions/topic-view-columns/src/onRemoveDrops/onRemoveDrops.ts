import { Core } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { Views } from '@minddrop/views';
import {
  TopicViewColumnsInstance,
  UpdateTopicViewColumnsInstanceData,
} from '../types';
import { removeItemsFromColumns } from '../removeItemsFromColumns';
import { removeEmptiedColumns } from '../removeEmptiedColumns';

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
  let columns = removeItemsFromColumns(
    viewInstance.columns,
    Object.keys(drops),
  );

  // Remove emptied columns
  columns = removeEmptiedColumns(viewInstance.columns, columns);

  // Update the view instance
  Views.updateInstance<UpdateTopicViewColumnsInstanceData>(
    core,
    viewInstance.id,
    {
      columns,
    },
  );
}