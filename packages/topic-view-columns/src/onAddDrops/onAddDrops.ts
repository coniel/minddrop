import { Core } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { Views } from '@minddrop/views';
import { distributeItemsBetweenColumns } from '../distributeItemsBetweenColumns';
import {
  ColumnItem,
  ColumnsAddDropsMetadata,
  TopicViewColumnsInstance,
  UpdateTopicViewColumnsInstanceData,
} from '../types';

/**
 * Adds drops to a column specified in metadata or distributes
 * them between columns if metadata is not present or was set
 * by another view instance.
 *
 * @param core A MindDrop core instance.
 * @param viewInstance The topic view instance.
 * @param drops The added drops.
 * @param metadata The event metadata.
 */
export function onAddDrops(
  core: Core,
  viewInstance: TopicViewColumnsInstance,
  drops: DropMap,
  metadata?: ColumnsAddDropsMetadata,
): void {
  // Ignore metadata if not present or if it was set by another view instance.
  const ignoreMetadata = !metadata || metadata.viewInstance !== viewInstance.id;
  const items: ColumnItem[] = Object.keys(drops).map((dropId) => ({
    type: 'drop',
    id: dropId,
  }));

  let { columns }: UpdateTopicViewColumnsInstanceData = viewInstance;

  if (ignoreMetadata) {
    // Distribute drops between the columns
    columns = distributeItemsBetweenColumns(viewInstance.columns, items);
  } else {
    // Merge into column at specified index
    const column = viewInstance.columns[metadata.column];
    const updatedColumn = column
      .slice(0, metadata.index)
      .concat(items, column.slice(metadata.index));

    columns = [...viewInstance.columns];
    columns[metadata.column] = updatedColumn;
  }

  // Update the instance
  Views.updateInstance<UpdateTopicViewColumnsInstanceData>(
    core,
    viewInstance.id,
    {
      columns,
    },
  );
}
