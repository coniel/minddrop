import React, { useCallback, useMemo } from 'react';
import { DataViewTypeComponentProps, DataViews } from '@minddrop/data-views';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { ScrollArea } from '@minddrop/ui-primitives';
import { BoardViewColumn } from '../BoardViewColumn';
import { defaultBoardViewData } from '../constants';
import { BoardColumns, BoardViewData } from '../types';
import { reconcileColumns } from '../utils';
import './BoardView.css';

/**
 * Renders a board view with draggable columns of entry cards.
 */
export const BoardViewComponent: React.FC<
  DataViewTypeComponentProps<object, BoardViewData>
> = ({ view, entries }) => {
  // Resolve columns from view data, falling back to defaults
  const columns = useMemo(
    () => view.data?.columns || defaultBoardViewData.columns,
    [view.data],
  );

  // Reconcile the saved column layout with the current entries
  // from the collection. Entries added to the collection but not
  // yet placed in a column go into the first column. Entries
  // removed from the collection are filtered out.
  const reconciledColumns = useMemo(
    () => reconcileColumns(columns, entries),
    [columns, entries],
  );

  // Persist the updated column layout to the view data
  const updateColumns = useCallback(
    (updatedColumns: BoardColumns) => {
      DataViews.update(view.id, { data: { columns: updatedColumns } });
    },
    [view.id],
  );

  // Handle dropping an entry into a column
  const handleColumnDrop = useCallback(
    (
      data: DropEventData,
      entryId: string,
      targetColumnIndex: number,
      targetEntryIndex: number,
    ) => {
      const updated = reconciledColumns.map((column) => [...column]);

      // Remove the entry from its current column
      for (const column of updated) {
        const index = column.indexOf(entryId);

        if (index !== -1) {
          column.splice(index, 1);

          break;
        }
      }

      // Insert at the target position
      updated[targetColumnIndex].splice(targetEntryIndex, 0, entryId);

      updateColumns(updated);
    },
    [reconciledColumns, updateColumns],
  );

  // Handle dropping an entry between columns to create a new column
  const handleColumnLayoutDrop = useCallback(
    (data: DropEventData, _containerId: string, gapIndex: number) => {
      const entryId = data.data as string;

      if (!entryId) {
        return;
      }

      const updated = reconciledColumns.map((column) => [...column]);

      // Remove the entry from its current column
      for (const column of updated) {
        const index = column.indexOf(entryId);

        if (index !== -1) {
          column.splice(index, 1);

          break;
        }
      }

      // Insert a new column at the gap position with this entry
      updated.splice(gapIndex, 0, [entryId]);

      updateColumns(updated);
    },
    [reconciledColumns, updateColumns],
  );

  // Handle deleting an empty column
  const handleDeleteColumn = useCallback(
    (columnIndex: number) => {
      const updated = reconciledColumns.filter(
        (_, index) => index !== columnIndex,
      );

      // Always keep at least one column
      updateColumns(updated.length > 0 ? updated : [[]]);
    },
    [reconciledColumns, updateColumns],
  );

  return (
    <ScrollArea className="board-view-scroll">
      <FlexDropContainer
        id={`board-${view.id}`}
        direction="row"
        gap={16}
        className="board-view"
        onDrop={handleColumnLayoutDrop}
      >
        {reconciledColumns.map((columnEntries, columnIndex) => (
          <BoardViewColumn
            key={columnIndex}
            columnIndex={columnIndex}
            entryIds={columnEntries}
            canDelete={
              columnEntries.length === 0 && reconciledColumns.length > 1
            }
            onDrop={handleColumnDrop}
            onDelete={handleDeleteColumn}
          />
        ))}
      </FlexDropContainer>
    </ScrollArea>
  );
};
