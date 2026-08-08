import React, { useCallback, useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { DataViewTypeComponentProps, DataViews } from '@minddrop/data-views';
import { DatabaseEntries, DatabaseId } from '@minddrop/databases';
import {
  getDroppedEntryIds,
  getDroppedNewEntryDatabaseIds,
} from '@minddrop/feature-databases';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { ScrollArea } from '@minddrop/ui-primitives';
import { BoardViewColumn } from '../BoardViewColumn';
import { BoardViewToolbar } from '../BoardViewToolbar';
import { defaultBoardViewData } from '../constants';
import { BoardColumns, BoardViewData, BoardViewOptions } from '../types';
import {
  placeEntryInColumn,
  placeEntryInNewColumn,
  reconcileColumns,
} from '../utils';
import './BoardView.css';

/**
 * Renders a board view with draggable columns of entry cards.
 */
export const BoardViewComponent: React.FC<
  DataViewTypeComponentProps<BoardViewOptions, BoardViewData>
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

  // Map each entry to the card layout its database is
  // overridden to use
  const entryCardLayouts = useMemo(
    () =>
      DatabaseEntries.resolveLayoutOverrides(
        entries,
        view.options?.cardLayoutOverrides,
      ),
    [entries, view.options?.cardLayoutOverrides],
  );

  // Persist the updated column layout to the view data
  const updateColumns = useCallback(
    (updatedColumns: BoardColumns) => {
      DataViews.update(view.id, { data: { columns: updatedColumns } });
    },
    [view.id],
  );

  // Create an entry in the given database, place it on the board,
  // and add it to the board's collection
  const createEntry = useCallback(
    async (
      databaseId: DatabaseId,
      placeEntry: (entryId: string) => BoardColumns,
    ) => {
      const entry = await DatabaseEntries.create(databaseId);

      // Place the entry before adding it to the collection, otherwise
      // it is briefly reconciled into the first column
      updateColumns(placeEntry(entry.id));

      await Collections.addItems(view.dataSource.id, [entry.id]);
    },
    [view.dataSource.id, updateColumns],
  );

  // Handle dropping an entry or new entry card into a column
  const handleColumnDrop = useCallback(
    async (
      data: DropEventData,
      targetColumnIndex: number,
      targetEntryIndex: number,
    ) => {
      // Existing entries are moved to the drop position
      const [droppedEntryId] = getDroppedEntryIds(data);

      if (droppedEntryId) {
        updateColumns(
          placeEntryInColumn(
            reconciledColumns,
            droppedEntryId,
            targetColumnIndex,
            targetEntryIndex,
          ),
        );

        return;
      }

      // New entry cards create an entry at the drop position
      const [databaseId] = getDroppedNewEntryDatabaseIds(data);

      if (!databaseId) {
        return;
      }

      await createEntry(databaseId, (entryId) =>
        placeEntryInColumn(
          reconciledColumns,
          entryId,
          targetColumnIndex,
          targetEntryIndex,
        ),
      );
    },
    [reconciledColumns, updateColumns, createEntry],
  );

  // Handle dropping between columns to create a new column
  const handleColumnLayoutDrop = useCallback(
    async (data: DropEventData, _containerId: string, gapIndex: number) => {
      // Existing entries are moved into the new column
      const [droppedEntryId] = getDroppedEntryIds(data);

      if (droppedEntryId) {
        updateColumns(
          placeEntryInNewColumn(reconciledColumns, droppedEntryId, gapIndex),
        );

        return;
      }

      // New entry cards create an entry in the new column
      const [databaseId] = getDroppedNewEntryDatabaseIds(data);

      if (!databaseId) {
        return;
      }

      await createEntry(databaseId, (entryId) =>
        placeEntryInNewColumn(reconciledColumns, entryId, gapIndex),
      );
    },
    [reconciledColumns, updateColumns, createEntry],
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
    <ScrollArea className="board-view-scroll" stateKey="content">
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
            entryCardLayouts={entryCardLayouts}
            canDelete={
              columnEntries.length === 0 && reconciledColumns.length > 1
            }
            onDrop={handleColumnDrop}
            onDelete={handleDeleteColumn}
          />
        ))}
      </FlexDropContainer>

      {/* Floating toolbar */}
      <BoardViewToolbar entryIds={entries} />
    </ScrollArea>
  );
};
