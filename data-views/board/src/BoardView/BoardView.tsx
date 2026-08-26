import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Collections } from '@minddrop/collections';
import { DataViewTypeComponentProps, DataViews } from '@minddrop/data-views';
import {
  DatabaseEntries,
  DatabaseEntryDuplicatedEvent,
  DatabaseId,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DataViewOptionsMenu } from '@minddrop/feature-data-views';
import {
  dropContainsAddExistingEntryCard,
  dropContainsNewEntryPickerCard,
  getDroppedEntryIds,
  getDroppedNewEntryDatabaseIds,
} from '@minddrop/feature-databases';
import { DropEventData } from '@minddrop/selection';
import {
  DataViewEntryPicker,
  DataViewFloatingToolbar,
  DataViewNewEntryPicker,
  DatabaseEntryContextProvider,
} from '@minddrop/ui-databases';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { ScrollArea } from '@minddrop/ui-primitives';
import { BoardViewColumn } from '../BoardViewColumn';
import { BOARD_ACCEPTED_DATA_TYPES, defaultBoardViewData } from '../constants';
import { BoardColumns, BoardViewData, BoardViewOptions } from '../types';
import {
  placeEntryBelow,
  placeEntryInColumn,
  placeEntryInNewColumn,
  reconcileColumns,
} from '../utils';
import './BoardView.css';

interface EntryPickerState {
  /**
   * The picker to render: an existing entry picker or a new
   * entry picker.
   */
  type: 'existing' | 'new';

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

  // The active entry picker, spawned by dropping the add existing
  // entry or new entry card
  const [entryPicker, setEntryPicker] = useState<EntryPickerState | null>(null);

  // Whether the view options menu in the toolbar is open
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);

  // The ID of the just created entry whose card should autofocus
  // its editor, cleared once the card has mounted
  const [autoFocusEntryId, setAutoFocusEntryId] = useState<string>();

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

  // Derive a toolbar card for each database the board's entries
  // belong to, excluding those whose card the user has hidden
  const toolbarDatabaseCards = useMemo(() => {
    const toolbarCards = view.options?.toolbarCards;

    return Databases.getFromEntries(entries)
      .filter((database) => !toolbarCards?.[database.id]?.hidden)
      .map((database) => ({
        databaseId: database.id,
        templateId: toolbarCards?.[database.id]?.templateId,
      }));
  }, [entries, view.options?.toolbarCards]);

  // Persist the updated column layout to the view data
  const updateColumns = useCallback(
    (updatedColumns: BoardColumns) => {
      DataViews.update(view.id, { data: { columns: updatedColumns } });
    },
    [view.id],
  );

  // Place duplicated entries directly below their original. Fired
  // before the duplicate is added to the collection, so placing it
  // now keeps it from being reconciled into the first column.
  useEffect(() => {
    Events.addListener(
      DatabaseEntryDuplicatedEvent,
      `board-view-${view.id}`,
      ({ data }) => {
        // Ignore duplications from other sources
        if (data.source?.id !== view.dataSource.id) {
          return;
        }

        const updated = placeEntryBelow(
          reconciledColumns,
          data.original.id,
          data.duplicate.id,
        );

        // Skip the update if the original is not on the board
        if (updated !== reconciledColumns) {
          updateColumns(updated);
        }
      },
    );

    return () => {
      Events.removeListener(
        DatabaseEntryDuplicatedEvent,
        `board-view-${view.id}`,
      );
    };
  }, [view.id, view.dataSource.id, reconciledColumns, updateColumns]);

  // Scroll an entry's card into view once it has been rendered
  const scrollEntryIntoView = useCallback((entryId: string) => {
    // Deferred to the frame after the layout update
    requestAnimationFrame(() => {
      scrollRootRef.current
        ?.querySelector(`[data-entry-id="${entryId}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }, []);

  // Create an entry in the given database, optionally from an
  // entry template, place it on the board, and add it to the
  // board's collection
  const createEntry = useCallback(
    async (
      databaseId: DatabaseId,
      placeEntry: (entryId: string) => BoardColumns,
      templateId?: string,
    ) => {
      // Create from the template when one is picked
      const entry = templateId
        ? await DatabaseEntries.createFromTemplate(databaseId, templateId)
        : await DatabaseEntries.create(databaseId);

      // Place the entry before adding it to the collection, otherwise
      // it is briefly reconciled into the first column
      updateColumns(placeEntry(entry.id));

      // Autofocus the new entry's editor once its card mounts
      setAutoFocusEntryId(entry.id);

      // Bring the new entry's card into view if the drop position
      // only partially fit on screen
      scrollEntryIntoView(entry.id);

      await Collections.addItems(view.dataSource.id, [entry.id]);
    },
    [view.dataSource.id, updateColumns, scrollEntryIntoView],
  );

  // Clear the autofocus once the new entry's card has mounted
  const handleEntryAutoFocused = useCallback(() => {
    setAutoFocusEntryId(undefined);
  }, []);

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

      // Picker cards spawn their picker at the drop position
      const pickerType = droppedPickerType(data);

      if (pickerType) {
        setEntryPicker({
          type: pickerType,
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

      // New entry cards create an entry at the drop position,
      // using the card's configured template when set
      const [databaseId] = getDroppedNewEntryDatabaseIds(data);

      if (!databaseId) {
        return;
      }

      await createEntry(
        databaseId,
        (entryId) =>
          placeEntryInColumn(
            reconciledColumns,
            entryId,
            targetColumnIndex,
            targetEntryIndex,
          ),
        toolbarCardTemplateId(view.options, databaseId),
      );
    },
    [reconciledColumns, updateColumns, createEntry, entryPicker, view.options],
  );

  // Handle dropping between columns to create a new column
  const handleColumnLayoutDrop = useCallback(
    async (data: DropEventData, _containerId: string, gapIndex: number) => {
      // Picker cards spawn their picker in a new column
      const pickerType = droppedPickerType(data);

      if (pickerType) {
        const updated = [...reconciledColumns];

        updated.splice(gapIndex, 0, []);

        updateColumns(updated);
        setEntryPicker({
          type: pickerType,
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

      // New entry cards create an entry in the new column,
      // using the card's configured template when set
      const [databaseId] = getDroppedNewEntryDatabaseIds(data);

      if (!databaseId) {
        return;
      }

      await createEntry(
        databaseId,
        (entryId) =>
          placeEntryInNewColumn(reconciledColumns, entryId, gapIndex),
        toolbarCardTemplateId(view.options, databaseId),
      );
    },
    [reconciledColumns, updateColumns, createEntry, view.options],
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

  // Handle picking a database to create a new entry in, replacing
  // the picker
  const handleNewEntryPickerSelect = useCallback(
    async (databaseId: DatabaseId, templateId?: string) => {
      if (!entryPicker) {
        return;
      }

      setEntryPicker(null);

      await createEntry(
        databaseId,
        (entryId) =>
          placeEntryInColumn(
            reconciledColumns,
            entryId,
            entryPicker.columnIndex,
            entryPicker.entryIndex,
          ),
        templateId,
      );
    },
    [entryPicker, createEntry, reconciledColumns],
  );

  // Handle picking a database while keeping the picker open: the
  // new entry lands above the picker, shifting it down a slot
  const handleNewEntryPickerSecondarySelect = useCallback(
    async (databaseId: DatabaseId, templateId?: string) => {
      if (!entryPicker) {
        return;
      }

      setEntryPicker({
        ...entryPicker,
        entryIndex: entryPicker.entryIndex + 1,
      });

      await createEntry(
        databaseId,
        (entryId) =>
          placeEntryInColumn(
            reconciledColumns,
            entryId,
            entryPicker.columnIndex,
            entryPicker.entryIndex,
          ),
        templateId,
      );
    },
    [entryPicker, createEntry, reconciledColumns],
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

  // Render the picker active in the given column, if any
  function renderColumnPicker(columnIndex: number) {
    // No picker active in this column
    if (entryPicker?.columnIndex !== columnIndex) {
      return undefined;
    }

    // New entry picker for creating an entry at the picker position
    if (entryPicker.type === 'new') {
      return (
        <DataViewNewEntryPicker
          scrollIntoView
          className="board-view-picker"
          onSelect={handleNewEntryPickerSelect}
          onSecondarySelect={handleNewEntryPickerSecondarySelect}
          onDismiss={handleEntryPickerDismiss}
        />
      );
    }

    // Existing entry picker for adding an entry to the board
    return (
      <DataViewEntryPicker
        scrollIntoView
        className="board-view-picker"
        excludeIds={entries}
        onSelect={handleEntryPickerSelect}
        onSecondarySelect={handleEntryPickerSecondarySelect}
        onDismiss={handleEntryPickerDismiss}
      />
    );
  }

  return (
    <ScrollArea
      ref={scrollRootRef}
      className="board-view-scroll floating-toolbar-host"
      stateKey="content"
    >
      <DatabaseEntryContextProvider
        draggable
        optionsMenu
        source={view.dataSource}
        autoFocusEntryId={autoFocusEntryId}
        onEntryAutoFocused={handleEntryAutoFocused}
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
              picker={renderColumnPicker(columnIndex)}
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
      <DataViewFloatingToolbar
        databaseCards={toolbarDatabaseCards}
        menuOpen={optionsMenuOpen}
      >
        {/* View settings menu */}
        <DataViewOptionsMenu view={view} onOpenChange={setOptionsMenuOpen} />
      </DataViewFloatingToolbar>
    </ScrollArea>
  );
};

// Resolve the entry template configured for a database's toolbar
// card, ignoring templates which no longer exist
function toolbarCardTemplateId(
  options: Partial<BoardViewOptions> | undefined,
  databaseId: DatabaseId,
): string | undefined {
  const templateId = options?.toolbarCards?.[databaseId]?.templateId;

  // No template configured for the card
  if (!templateId) {
    return undefined;
  }

  // Check that the template still exists on the database
  const database = Databases.get(databaseId, false);
  const exists = database?.entryTemplates?.some(
    (template) => template.id === templateId,
  );

  return exists ? templateId : undefined;
}

// Resolve the type of picker card contained in a drop, if any
function droppedPickerType(
  data: DropEventData,
): EntryPickerState['type'] | null {
  // Add existing entry cards spawn the existing entry picker
  if (dropContainsAddExistingEntryCard(data)) {
    return 'existing';
  }

  // New entry cards spawn the new entry picker
  if (dropContainsNewEntryPickerCard(data)) {
    return 'new';
  }

  return null;
}
