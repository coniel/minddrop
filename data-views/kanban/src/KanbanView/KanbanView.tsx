import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Collections } from '@minddrop/collections';
import { DataViewTypeComponentProps, DataViews } from '@minddrop/data-views';
import { DatabaseEntries, DatabaseId, Databases } from '@minddrop/databases';
import { DataViewOptionsMenu } from '@minddrop/feature-data-views';
import {
  dropContainsAddExistingEntryCard,
  dropContainsNewEntryPickerCard,
  getDroppedEntryIds,
  getDroppedNewEntryDatabaseIds,
} from '@minddrop/feature-databases';
import { SelectPropertySchema } from '@minddrop/properties';
import { DropEventData } from '@minddrop/selection';
import {
  DataViewEntryPicker,
  DataViewFloatingToolbar,
  DataViewNewEntryPicker,
  DatabaseEntryContextProvider,
} from '@minddrop/ui-databases';
import {
  Group,
  ScrollArea,
  Stack,
  Text,
  ViewFloatingToolbar,
} from '@minddrop/ui-primitives';
import { KanbanViewColumn } from '../KanbanViewColumn';
import { KanbanViewColumnHeading } from '../KanbanViewColumnHeading';
import {
  NO_VALUE_COLUMN,
  defaultKanbanViewData,
  defaultKanbanViewOptions,
} from '../constants';
import { KanbanOrder, KanbanViewData, KanbanViewOptions } from '../types';
import { useKanbanGroupProperty } from '../useKanbanGroupProperty';
import {
  applyColumnValue,
  placeEntryInColumn,
  resolveKanbanColumns,
} from '../utils';
import './KanbanView.css';

interface EntryPickerState {
  /**
   * The picker to render: an existing entry picker or a new
   * entry picker.
   */
  type: 'existing' | 'new';

  /**
   * The option value keying the column the picker is in.
   */
  columnValue: string;

  /**
   * The position within the column at which the picker is placed.
   */
  entryIndex: number;
}

/**
 * Renders a kanban view: a column per option of a select
 * property, with the cards a user drags between them taking the
 * column's value.
 */
export const KanbanViewComponent: React.FC<
  DataViewTypeComponentProps<KanbanViewOptions, KanbanViewData>
> = ({ view, entries }) => {
  const scrollRootRef = useRef<HTMLDivElement>(null);

  // The active entry picker, spawned by dropping the add existing
  // entry or new entry card.
  const [entryPicker, setEntryPicker] = useState<EntryPickerState | null>(null);

  // Whether the view options menu in the toolbar is open
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);

  // The ID of the just created entry whose card should autofocus
  // its editor, cleared once the card has mounted.
  const [autoFocusEntryId, setAutoFocusEntryId] = useState<string>();

  // The select property the columns are generated from
  const { property, databaseId } = useKanbanGroupProperty(view);

  // Subscribes to the entries so that the columns re-resolve when
  // their property values change.
  const databaseEntries = DatabaseEntries.useByIds(entries);

  // Filter out entries from databases which do not declare the
  // group property, as they have no column to sit in.
  const groupedEntries = useMemo(
    () => databaseEntries.filter((entry) => entry.database === databaseId),
    [databaseEntries, databaseId],
  );

  // Resolve the saved order from view data, falling back to
  // defaults.
  const order = useMemo(
    () => view.data?.order || defaultKanbanViewData.order,
    [view.data],
  );

  // Generate the columns and place the entries in them
  const columns = useMemo(
    () =>
      property ? resolveKanbanColumns(groupedEntries, property, order) : [],
    [groupedEntries, property, order],
  );

  // Map each entry to the card layout its database is overridden
  // to use.
  const entryCardLayouts = useMemo(
    () =>
      DatabaseEntries.resolveLayoutOverrides(
        entries,
        view.options?.cardLayoutOverrides,
      ),
    [entries, view.options?.cardLayoutOverrides],
  );

  // Build the toolbar's card for the grouped database, which is
  // the only one entries can be created in.
  const toolbarDatabaseCards = useMemo(() => {
    // Check that a database has resolved. Until one does there is
    // nothing to create entries in.
    if (!databaseId) {
      return [];
    }

    const toolbarCard = view.options?.toolbarCards?.[databaseId];

    // Check if the user has hidden the database's card
    if (toolbarCard?.hidden) {
      return [];
    }

    return [{ databaseId, templateId: toolbarCard?.templateId }];
  }, [databaseId, view.options?.toolbarCards]);

  // Persist the updated entry order to the view data
  const updateOrder = useCallback(
    (updatedOrder: KanbanOrder) => {
      DataViews.update(view.id, { data: { order: updatedOrder } });
    },
    [view.id],
  );

  // Move an entry into a column, both positioning it and writing
  // the column's value to its group property.
  const moveEntryToColumn = useCallback(
    async (
      entryId: string,
      groupProperty: SelectPropertySchema,
      columnValue: string,
      entryIndex: number,
    ) => {
      const entry = DatabaseEntries.get(entryId);

      // Check that the entry belongs to the grouped database.
      // Entries from other databases have no group property to
      // write the column's value to.
      if (entry.database !== databaseId) {
        return;
      }

      // Position the entry before the value write, so that the
      // card does not jump to the bottom of the column first.
      updateOrder(placeEntryInColumn(order, entryId, columnValue, entryIndex));

      // Write the column's value to the entry's group property
      await DatabaseEntries.updateProperty(
        entryId,
        groupProperty.name,
        applyColumnValue(
          entry.properties[groupProperty.name],
          groupProperty,
          columnValue,
        ),
      );
    },
    [databaseId, order, updateOrder],
  );

  // Scroll an entry's card into view once it has been rendered
  const scrollEntryIntoView = useCallback((entryId: string) => {
    // Scroll on the frame after the layout update
    requestAnimationFrame(() => {
      scrollRootRef.current
        ?.querySelector(`[data-entry-id="${entryId}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }, []);

  // Create an entry in a column, optionally from an entry
  // template, giving it the column's group property value.
  const createEntry = useCallback(
    async (
      newEntryDatabaseId: DatabaseId,
      columnValue: string,
      entryIndex: number,
      templateId?: string,
    ) => {
      // Check that a group property is available, since the
      // column's value is written to it.
      if (!property) {
        return;
      }

      // Create the entry, from the template when the card has one
      const entry = templateId
        ? await DatabaseEntries.createFromTemplate(
            newEntryDatabaseId,
            templateId,
          )
        : await DatabaseEntries.create(newEntryDatabaseId);

      // Position the entry before it enters the view, otherwise
      // it briefly appears at the bottom of its column.
      updateOrder(placeEntryInColumn(order, entry.id, columnValue, entryIndex));

      // Autofocus the new entry's editor once its card mounts
      setAutoFocusEntryId(entry.id);

      // Bring the new entry's card into view if the drop position
      // only partially fit on screen.
      scrollEntryIntoView(entry.id);

      // Check if the entry was created in an option's column. If
      // so, it takes the option's value.
      if (columnValue !== NO_VALUE_COLUMN) {
        await DatabaseEntries.updateProperty(
          entry.id,
          property.name,
          applyColumnValue(null, property, columnValue),
        );
      }

      // Check if the source is a collection. Collections list
      // their entries explicitly, unlike databases and queries.
      if (view.dataSource.type === 'collection') {
        await Collections.addItems(view.dataSource.id, [entry.id]);
      }
    },
    [
      property,
      order,
      updateOrder,
      scrollEntryIntoView,
      view.dataSource.type,
      view.dataSource.id,
    ],
  );

  // Clear the autofocus once the new entry's card has mounted
  const handleEntryAutoFocused = useCallback(() => {
    setAutoFocusEntryId(undefined);
  }, []);

  // Handle dropping an entry, new entry card, or add existing
  // entry card into a column.
  const handleColumnDrop = useCallback(
    async (
      data: DropEventData,
      columnValue: string,
      rawTargetEntryIndex: number,
    ) => {
      // Check that a group property is available to write the
      // column's value to
      if (!property) {
        return;
      }

      // Shift drops below the picker back into column order
      // positions. While the picker is open in the target column
      // it occupies a slot the column order does not have.
      const targetEntryIndex =
        entryPicker &&
        entryPicker.columnValue === columnValue &&
        rawTargetEntryIndex > entryPicker.entryIndex
          ? rawTargetEntryIndex - 1
          : rawTargetEntryIndex;

      // The type of picker card dropped, if any
      const pickerType = droppedPickerType(data);

      // Check if a picker card was dropped. If so, its picker
      // spawns at the drop position.
      if (pickerType) {
        setEntryPicker({
          type: pickerType,
          columnValue,
          entryIndex: targetEntryIndex,
        });

        return;
      }

      // The existing entry dropped, if any
      const [droppedEntryId] = getDroppedEntryIds(data);

      // Check if an existing entry was dropped. If so, it moves
      // to the drop position and takes the column's value.
      if (droppedEntryId) {
        await moveEntryToColumn(
          droppedEntryId,
          property,
          columnValue,
          targetEntryIndex,
        );

        return;
      }

      // The database of the new entry card dropped, if any
      const [newEntryDatabaseId] = getDroppedNewEntryDatabaseIds(data);

      // Check that a new entry card was dropped
      if (!newEntryDatabaseId) {
        return;
      }

      // Create the entry at the drop position, using the card's
      // configured template when set.
      await createEntry(
        newEntryDatabaseId,
        columnValue,
        targetEntryIndex,
        toolbarCardTemplateId(view.options, newEntryDatabaseId),
      );
    },
    [property, entryPicker, moveEntryToColumn, createEntry, view.options],
  );

  // Handle picking an existing entry, replacing the picker
  const handleEntryPickerSelect = useCallback(
    async (entryId: string) => {
      // Check that the picker and a group property are still
      // available
      if (!entryPicker || !property) {
        return;
      }

      // Close the picker
      setEntryPicker(null);

      // Check if the source is a collection. Collections list
      // their entries explicitly, unlike databases and queries.
      if (view.dataSource.type === 'collection') {
        await Collections.addItems(view.dataSource.id, [entryId]);
      }

      // Move the entry to the picker's position
      await moveEntryToColumn(
        entryId,
        property,
        entryPicker.columnValue,
        entryPicker.entryIndex,
      );
    },
    [
      entryPicker,
      property,
      moveEntryToColumn,
      view.dataSource.type,
      view.dataSource.id,
    ],
  );

  // Handle picking an entry while keeping the picker open
  const handleEntryPickerSecondarySelect = useCallback(
    async (entryId: string) => {
      // Check that the picker and a group property are still
      // available
      if (!entryPicker || !property) {
        return;
      }

      // Shift the picker down a slot, so that the entry lands
      // above it.
      setEntryPicker({
        ...entryPicker,
        entryIndex: entryPicker.entryIndex + 1,
      });

      // Check if the source is a collection. Collections list
      // their entries explicitly, unlike databases and queries.
      if (view.dataSource.type === 'collection') {
        await Collections.addItems(view.dataSource.id, [entryId]);
      }

      // Move the entry to the picker's old position
      await moveEntryToColumn(
        entryId,
        property,
        entryPicker.columnValue,
        entryPicker.entryIndex,
      );
    },
    [
      entryPicker,
      property,
      moveEntryToColumn,
      view.dataSource.type,
      view.dataSource.id,
    ],
  );

  // Handle picking a database to create a new entry in, replacing
  // the picker.
  const handleNewEntryPickerSelect = useCallback(
    async (newEntryDatabaseId: DatabaseId, templateId?: string) => {
      // Check that the picker is still open
      if (!entryPicker) {
        return;
      }

      // Close the picker
      setEntryPicker(null);

      // Create the entry at the picker's position
      await createEntry(
        newEntryDatabaseId,
        entryPicker.columnValue,
        entryPicker.entryIndex,
        templateId,
      );
    },
    [entryPicker, createEntry],
  );

  // Handle picking a database while keeping the picker open
  const handleNewEntryPickerSecondarySelect = useCallback(
    async (newEntryDatabaseId: DatabaseId, templateId?: string) => {
      // Check that the picker is still open
      if (!entryPicker) {
        return;
      }

      // Shift the picker down a slot, so that the new entry lands
      // above it.
      setEntryPicker({
        ...entryPicker,
        entryIndex: entryPicker.entryIndex + 1,
      });

      // Create the entry at the picker's old position
      await createEntry(
        newEntryDatabaseId,
        entryPicker.columnValue,
        entryPicker.entryIndex,
        templateId,
      );
    },
    [entryPicker, createEntry],
  );

  // Handle dismissing the picker without a selection
  const handleEntryPickerDismiss = useCallback(() => {
    setEntryPicker(null);
  }, []);

  // Render the picker active in the given column, if any
  function renderColumnPicker(columnValue: string) {
    // Check if a picker is active in this column
    if (entryPicker?.columnValue !== columnValue) {
      return undefined;
    }

    // Check if the picker creates a new entry, in which case the
    // database picker is rendered.
    if (entryPicker.type === 'new') {
      return (
        <DataViewNewEntryPicker
          scrollIntoView
          className="kanban-view-picker"
          onSelect={handleNewEntryPickerSelect}
          onSecondarySelect={handleNewEntryPickerSecondarySelect}
          onDismiss={handleEntryPickerDismiss}
        />
      );
    }

    // Render the existing entry picker, which adds an entry to
    // the board.
    return (
      <DataViewEntryPicker
        scrollIntoView
        className="kanban-view-picker"
        excludeIds={entries}
        onSelect={handleEntryPickerSelect}
        onSecondarySelect={handleEntryPickerSecondarySelect}
        onDismiss={handleEntryPickerDismiss}
      />
    );
  }

  // The classes styling the columns
  const columnClasses = resolveColumnClasses(view.options);

  // Whether each column's cards scroll on their own
  const columnScroll =
    view.options?.columnScroll ?? defaultKanbanViewOptions.columnScroll;

  // Whether entries can be created in the view. Queries build
  // their results from a filter, so a created entry would not
  // necessarily appear in it.
  const canCreateEntries = view.dataSource.type !== 'query';

  // Check that a select property is available. Without one there
  // are no columns to generate.
  if (!property) {
    return (
      <Stack gap={2} align="center" className="kanban-view-empty">
        <Text weight="medium" text="dataViews.kanban.noSelectProperty.title" />
        <Text
          size="sm"
          color="subtle"
          text="dataViews.kanban.noSelectProperty.description"
        />
      </Stack>
    );
  }

  return (
    <ScrollArea
      ref={scrollRootRef}
      className="kanban-view-scroll floating-toolbar-host"
      stateKey="content"
    >
      <Stack gap={0} className={`kanban-view ${columnClasses}`.trim()}>
        {/** Column headings **/}
        <Group gap={4} align="stretch" className="kanban-view-headings">
          {columns.map((column) => (
            <KanbanViewColumnHeading key={column.value} column={column} />
          ))}
        </Group>

        {/** Column bodies **/}
        <DatabaseEntryContextProvider
          draggable
          optionsMenu
          source={view.dataSource}
          autoFocusEntryId={autoFocusEntryId}
          onEntryAutoFocused={handleEntryAutoFocused}
        >
          <Group gap={4} align="stretch" className="kanban-view-columns">
            {columns.map((column) => (
              <KanbanViewColumn
                key={column.value}
                column={column}
                scroll={columnScroll}
                entryCardLayouts={entryCardLayouts}
                picker={renderColumnPicker(column.value)}
                pickerIndex={
                  entryPicker?.columnValue === column.value
                    ? entryPicker.entryIndex
                    : undefined
                }
                onDrop={handleColumnDrop}
              />
            ))}
          </Group>
        </DatabaseEntryContextProvider>
      </Stack>

      {/** Floating toolbar **/}
      {canCreateEntries ? (
        <DataViewFloatingToolbar
          databaseCards={toolbarDatabaseCards}
          menuOpen={optionsMenuOpen}
        >
          {/** View settings menu **/}
          <DataViewOptionsMenu view={view} onOpenChange={setOptionsMenuOpen} />
        </DataViewFloatingToolbar>
      ) : (
        <ViewFloatingToolbar menuOpen={optionsMenuOpen}>
          {/** View settings menu **/}
          <DataViewOptionsMenu view={view} onOpenChange={setOptionsMenuOpen} />
        </ViewFloatingToolbar>
      )}
    </ScrollArea>
  );
};

/**
 * Resolves the classes styling a board's columns.
 *
 * @param options - The view's options.
 * @returns The column classes, empty while the columns take their default styling.
 */
function resolveColumnClasses(
  options: Partial<KanbanViewOptions> | undefined,
): string {
  const width = options?.columnWidth ?? defaultKanbanViewOptions.columnWidth;
  const background =
    options?.columnBackground ?? defaultKanbanViewOptions.columnBackground;
  const scroll = options?.columnScroll ?? defaultKanbanViewOptions.columnScroll;
  const classes = [];

  // Fill width columns take the width the column's own styles
  // already give them.
  if (width !== 'fill') {
    classes.push('kanban-view-columns-fixed', `kanban-view-columns-${width}`);
  }

  // Backgroundless columns are drawn straight onto the view
  if (background !== 'none') {
    classes.push(`kanban-view-columns-background-${background}`);
  }

  // Columns scrolling on their own are bound to the board's
  // height rather than growing past it
  if (scroll) {
    classes.push('kanban-view-columns-scroll');
  }

  return classes.join(' ');
}

/**
 * Resolves the entry template configured for a database's toolbar
 * card, ignoring templates which no longer exist.
 *
 * @param options - The view's options.
 * @param databaseId - The ID of the database whose card is being used.
 * @returns The ID of the card's entry template, or undefined when it has none.
 */
function toolbarCardTemplateId(
  options: Partial<KanbanViewOptions> | undefined,
  databaseId: DatabaseId,
): string | undefined {
  const templateId = options?.toolbarCards?.[databaseId]?.templateId;

  // Check if a template is configured for the card
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

/**
 * Resolves the type of picker card contained in a drop.
 *
 * @param data - The drop event data.
 * @returns The type of picker the dropped card spawns, or null if it is not a picker card.
 */
function droppedPickerType(
  data: DropEventData,
): EntryPickerState['type'] | null {
  // Check for an add existing entry card, which spawns the
  // existing entry picker.
  if (dropContainsAddExistingEntryCard(data)) {
    return 'existing';
  }

  // Check for a new entry card, which spawns the new entry picker
  if (dropContainsNewEntryPickerCard(data)) {
    return 'new';
  }

  return null;
}
