import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Collections } from '@minddrop/collections';
import { DataViewTypeComponentProps, DataViews } from '@minddrop/data-views';
import { DatabaseEntries, DatabaseId } from '@minddrop/databases';
import {
  DatabaseEntryContextProvider,
  dropContainsAddExistingEntryCard,
  getDroppedEntryIds,
  getDroppedNewEntryDatabaseIds,
} from '@minddrop/feature-databases';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { ScrollArea } from '@minddrop/ui-primitives';
import { BoardViewColumn } from '../BoardViewColumn';
import { BoardViewEntryPicker } from '../BoardViewEntryPicker';
import { BoardViewToolbar } from '../BoardViewToolbar';
import { BOARD_ACCEPTED_DATA_TYPES, defaultBoardViewData } from '../constants';
import { BoardColumns, BoardViewData, BoardViewOptions } from '../types';
import {
  placeEntryInColumn,
  placeEntryInNewColumn,
  reconcileColumns,
} from '../utils';
import './BoardView.css';

interface EntryPickerState {
  /**
   * The index of the column the picker is in.
   */
  columnIndex: number;

  /**
   * The position within the column at which the picker is placed.
   */
  entryIndex: number;

  /**
   * Whether the picker's column was created by the picker drop,
   * in which case dismissing the picker removes it again.
   */
  isNewColumn: boolean;
}

/**
 * Renders a board view with draggable columns of entry cards.
 */
export const BoardViewComponent: React.FC<
  DataViewTypeComponentProps<BoardViewOptions, BoardViewData>
> = ({ view, entries }) => {
  const scrollRootRef = useRef<HTMLDivElement>(null);

  // The active existing entry picker, spawned by dropping the
  // add existing entry card
  const [entryPicker, setEntryPicker] = useState<EntryPickerState | null>(null);

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

  // Scroll an entry's card into view once it has been rendered
  const scrollEntryIntoView = useCallback((entryId: string) => {
    // Deferred to the frame after the layout update
    requestAnimationFrame(() => {
      scrollRootRef.current
        ?.querySelector(`[data-entry-id="${entryId}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }, []);

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

      // Bring the new entry's card into view if the drop position
      // only partially fit on screen
      scrollEntryIntoView(entry.id);

      await Collections.addItems(view.dataSource.id, [entry.id]);
    },
    [view.dataSource.id, updateColumns, scrollEntryIntoView],
  );

  // Handle dropping an entry, new entry card, or add existing
  // entry card into a column
  const handleColumnDrop = useCallback(
    async (
      data: DropEventData,
      targetColumnIndex: number,
      rawTargetEntryIndex: number,
    ) => {
      // While the picker is open in the target column, it occupies
      // a slot the column data does not have. Shift drops below it
      // back into column data positions.
      const targetEntryIndex =
        entryPicker &&
        entryPicker.columnIndex === targetColumnIndex &&
        rawTargetEntryIndex > entryPicker.entryIndex
          ? rawTargetEntryIndex - 1
          : rawTargetEntryIndex;

      // Add existing entry cards spawn the picker at the drop position
      if (dropContainsAddExistingEntryCard(data)) {
        setEntryPicker({
          columnIndex: targetColumnIndex,
          entryIndex: targetEntryIndex,
          isNewColumn: false,
        });

        return;
      }

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
    [reconciledColumns, updateColumns, createEntry, entryPicker],
  );

  // Handle dropping between columns to create a new column
  const handleColumnLayoutDrop = useCallback(
    async (data: DropEventData, _containerId: string, gapIndex: number) => {
      // Add existing entry cards spawn the picker in a new column
      if (dropContainsAddExistingEntryCard(data)) {
        const updated = [...reconciledColumns];

        updated.splice(gapIndex, 0, []);

        updateColumns(updated);
        setEntryPicker({
          columnIndex: gapIndex,
          entryIndex: 0,
          isNewColumn: true,
        });

        return;
      }

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

  // Place a picked entry at the picker position and add it to
  // the board's collection
  const addPickedEntry = useCallback(
    async (entryId: string, picker: EntryPickerState) => {
      // Place the entry before adding it to the collection, otherwise
      // it is briefly reconciled into the first column
      updateColumns(
        placeEntryInColumn(
          reconciledColumns,
          entryId,
          picker.columnIndex,
          picker.entryIndex,
        ),
      );

      await Collections.addItems(view.dataSource.id, [entryId]);
    },
    [reconciledColumns, updateColumns, view.dataSource.id],
  );

  // Handle picking an existing entry, replacing the picker
  const handleEntryPickerSelect = useCallback(
    async (entryId: string) => {
      if (!entryPicker) {
        return;
      }

      setEntryPicker(null);

      await addPickedEntry(entryId, entryPicker);
    },
    [entryPicker, addPickedEntry],
  );

  // Handle picking an entry while keeping the picker open: the
  // entry lands above the picker, shifting it down a slot
  const handleEntryPickerSecondarySelect = useCallback(
    async (entryId: string) => {
      if (!entryPicker) {
        return;
      }

      setEntryPicker({
        ...entryPicker,
        entryIndex: entryPicker.entryIndex + 1,
      });

      await addPickedEntry(entryId, entryPicker);
    },
    [entryPicker, addPickedEntry],
  );

  // Handle dismissing the picker without a selection
  const handleEntryPickerDismiss = useCallback(() => {
    if (!entryPicker) {
      return;
    }

    // Remove the column the picker drop created if it is still empty
    if (
      entryPicker.isNewColumn &&
      reconciledColumns[entryPicker.columnIndex]?.length === 0 &&
      reconciledColumns.length > 1
    ) {
      updateColumns(
        reconciledColumns.filter(
          (_, index) => index !== entryPicker.columnIndex,
        ),
      );
    }

    setEntryPicker(null);
  }, [entryPicker, reconciledColumns, updateColumns]);

  return (
    <ScrollArea
      ref={scrollRootRef}
      className="board-view-scroll"
      stateKey="content"
    >
      <DatabaseEntryContextProvider
        draggable
        optionsMenu
        source={view.dataSource}
      >
        <FlexDropContainer
          id={`board-${view.id}`}
          direction="row"
          gap={16}
          className="board-view"
          accepts={BOARD_ACCEPTED_DATA_TYPES}
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
              picker={
                entryPicker?.columnIndex === columnIndex ? (
                  <BoardViewEntryPicker
                    excludeIds={entries}
                    onSelect={handleEntryPickerSelect}
                    onSecondarySelect={handleEntryPickerSecondarySelect}
                    onDismiss={handleEntryPickerDismiss}
                  />
                ) : undefined
              }
              pickerIndex={
                entryPicker?.columnIndex === columnIndex
                  ? entryPicker.entryIndex
                  : undefined
              }
              onDrop={handleColumnDrop}
              onDelete={handleDeleteColumn}
            />
          ))}
        </FlexDropContainer>
      </DatabaseEntryContextProvider>

      {/* Floating toolbar */}
      <BoardViewToolbar view={view} entryIds={entries} />
    </ScrollArea>
  );
};
