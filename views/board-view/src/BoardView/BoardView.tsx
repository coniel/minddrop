import React, { useCallback, useMemo } from 'react';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { ScrollArea } from '@minddrop/ui-primitives';
import { ViewTypeComponentProps, Views } from '@minddrop/views';
import { BoardViewColumn } from '../BoardViewColumn';
import { defaultBoardViewOptions } from '../constants';
import { BoardColumns, BoardViewOptions } from '../types';
import { reconcileColumns } from '../utils';
import './BoardView.css';

/**
 * Renders a board view with draggable columns of entry cards.
 */
export const BoardViewComponent: React.FC<
  ViewTypeComponentProps<BoardViewOptions>
> = ({ view, entries }) => {
  // Resolve columns from view options, falling back to defaults
  const columns = useMemo(
    () => view.options?.columns || defaultBoardViewOptions.columns,
    [view.options],
  );

  // Reconcile the saved column layout with the current entries
  // from the collection. Entries added to the collection but not
  // yet placed in a column go into the first column. Entries
  // removed from the collection are filtered out.
  const reconciledColumns = useMemo(
    () => reconcileColumns(columns, entries),
    [columns, entries],
  );

  // Persist the updated column layout to the view options
  const updateColumns = useCallback(
    (updatedColumns: BoardColumns) => {
      Views.update(view.id, { options: { columns: updatedColumns } });
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
