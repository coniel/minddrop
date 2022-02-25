import { Core } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { generateId } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { distributeItemsBetweenColumns } from '../distributeItemsBetweenColumns';
import {
  ColumnItem,
  Columns,
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

  let columns: Columns = JSON.parse(JSON.stringify(viewInstance.columns));

  if (ignoreMetadata) {
    // Distribute drops between the columns
    columns = distributeItemsBetweenColumns(viewInstance.columns, items);
  } else if (metadata.action === 'insert-into-column') {
    // Merge into column at specified index
    const column = viewInstance.columns[metadata.column];
    const updatedColumnItems = column.items
      .slice(0, metadata.index)
      .concat(items, column.items.slice(metadata.index));

    columns[metadata.column] = { ...column, items: updatedColumnItems };
  } else if (metadata.action === 'create-column') {
    // Insert items array in at specified column index to create a new column
    columns.splice(metadata.column, 0, { id: generateId(), items });
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
