import { Core } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { Views } from '@minddrop/views';
import {
  TopicViewColumnsInstance,
  UpdateTopicViewColumnsInstanceData,
} from '../types';

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
  const dropIds = Object.keys(drops);
  const columns = [...viewInstance.columns];

  // Loop through columns and filter out removed drop IDs
  columns.forEach((column, index) => {
    columns[index] = columns[index].filter(
      (item) => !dropIds.includes(item.id),
    );
  });

  // Update the view instance
  Views.updateInstance<UpdateTopicViewColumnsInstanceData>(
    core,
    viewInstance.id,
    {
      columns,
    },
  );
}
