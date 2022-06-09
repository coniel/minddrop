import { Core } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { generateId } from '@minddrop/utils';
import { ViewInstances } from '@minddrop/views';
import { ResourceReference } from '@minddrop/resources';
import { distributeItemsBetweenColumns } from '../distributeItemsBetweenColumns';
import {
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
  const items: ResourceReference[] = Object.keys(drops).map((dropId) => ({
    resource: 'drops:drop',
    id: dropId,
  }));

  let columns: Columns = JSON.parse(JSON.stringify(viewInstance.columns));

  if (ignoreMetadata) {
    // Create an array containing all of the columns item IDs
    const allDropIds = viewInstance.columns.reduce(
      (ids, columns) => [...ids, ...columns.items.map((item) => item.id)],
      [],
    );
    // Check the 'duplicatedFrom' property of all added drops
    // against the list of existing drop IDs. If every added
    // drop was duplicated from an existing drop, all added
    // drops are duplicates.
    const allDuplicates = Object.values(drops).reduce(
      (allDuplicates, drop) =>
        allDropIds.includes(drop.duplicatedFrom) ? allDuplicates : false,
      true,
    );

    // If all drops are duplicates, place added drops directly below their originals
    if (allDuplicates) {
      columns = columns.map((column) => ({
        ...column,
        // Loop through the column's items
        items: column.items.reduce((columnItems, item) => {
          // Check for added duplicate drop
          const duplicate = Object.values(drops).find(
            (drop) => drop.duplicatedFrom === item.id,
          );

          // If it has an added duplicate drop, insert it directly below
          if (duplicate) {
            return [
              ...columnItems,
              item,
              { id: duplicate.id, resource: 'drops:drop' },
            ];
          }

          // If there is not duplicate drop, do nothing
          return [...columnItems, item];
        }, []),
      }));
    } else {
      // Distribute drops between the columns
      columns = distributeItemsBetweenColumns(viewInstance.columns, items);
    }
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
  ViewInstances.update<UpdateTopicViewColumnsInstanceData>(
    core,
    viewInstance.id,
    {
      columns,
    },
  );
}
