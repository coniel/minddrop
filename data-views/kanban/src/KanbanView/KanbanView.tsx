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
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { getDroppedEntryIds } from '@minddrop/feature-databases';
import { SelectPropertySchema } from '@minddrop/properties';
import { DropEventData } from '@minddrop/selection';
import { DatabaseEntryContextProvider } from '@minddrop/ui-databases';
import {
  SortableItemRenderProps,
  SortableList,
  useDragEdgeScroll,
} from '@minddrop/ui-drag-and-drop';
import { Group, ScrollArea, Stack, Text } from '@minddrop/ui-primitives';
import { ContentColor } from '@minddrop/ui-theme';
import { KanbanViewColumn } from '../KanbanViewColumn';
import { KanbanViewColumnHeading } from '../KanbanViewColumnHeading';
import {
  clearPendingColumnRename,
  usePendingColumnRename,
} from '../PendingColumnRenameStore';
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
  resolveReorderedOptions,
} from '../utils';
import './KanbanView.css';

/**
 * Renders a kanban view: a column per option of a select
 * property, with the cards a user drags between them taking the
 * column's value.
 */
export const KanbanViewComponent: React.FC<
  DataViewTypeComponentProps<KanbanViewOptions, KanbanViewData>
> = ({ view, entries }) => {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // The ID of the just created entry whose card should autofocus
  // its editor, cleared once the card has mounted.
  const [autoFocusEntryId, setAutoFocusEntryId] = useState<string>();

  // The value of the column the pointer is over, whose heading
  // shows its actions.
  const [hoveredColumnValue, setHoveredColumnValue] = useState<string | null>(
    null,
  );

  // The select property the columns are generated from
  const { property, databaseId } = useKanbanGroupProperty(view);

  // In-flight option renames on the group property, aliasing old
  // values to new ones so entries the rename's side effects have
  // not rewritten yet stay in the renamed column rather than
  // dropping into the no-value column.
  const optionRenames = Events.useLogs(Databases.events.propertyOptionRenamed);
  const valueAliases = useMemo(() => {
    const aliases: Record<string, string> = {};

    optionRenames.forEach(({ data }) => {
      // Match renames on the grouped database's group property
      if (
        data.updated.id === databaseId &&
        data.property.name === property?.name
      ) {
        aliases[data.oldValue] = data.newValue;
      }
    });

    return aliases;
  }, [optionRenames, databaseId, property?.name]);

  // The value of a just added column whose rename popover should
  // open once its heading has rendered.
  const pendingRenameValue = usePendingColumnRename(view.id);

  // Subscribes to the entries so that the columns re-resolve when
  // their property values change.
  const databaseEntries = DatabaseEntries.useByIds(entries);

  // Scroll the board while a dragged card hovers near its edges
  useDragEdgeScroll(scrollViewportRef);

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

  // Map each duplicate among the entries to the entry it was
  // duplicated from. The column resolution places a duplicate below
  // its original until the placement listener has persisted its
  // position.
  const duplicateOriginals = useMemo(() => {
    const originals: Record<string, string> = {};

    groupedEntries.forEach((entry) => {
      if (entry.duplicatedFrom) {
        originals[entry.id] = entry.duplicatedFrom;
      }
    });

    return originals;
  }, [groupedEntries]);

  // Generate the columns and place the entries in them
  const columns = useMemo(
    () =>
      property
        ? resolveKanbanColumns(
            groupedEntries,
            property,
            order,
            valueAliases,
            duplicateOriginals,
          )
        : [],
    [groupedEntries, property, order, valueAliases, duplicateOriginals],
  );

  // The columns visible on the board, dropping hidden ones and,
  // when set to, empty ones.
  const visibleColumns = useMemo(() => {
    const hiddenOptions = view.options?.hiddenOptions ?? [];
    const hideEmpty = view.options?.hideEmptyColumns ?? false;

    return columns.filter((column) => {
      // Drop columns the user has hidden
      if (hiddenOptions.includes(column.value)) {
        return false;
      }

      // Drop empty columns when set to, except a just added one,
      // which is empty but about to be named.
      if (
        hideEmpty &&
        column.entryIds.length === 0 &&
        column.value !== pendingRenameValue
      ) {
        return false;
      }

      return true;
    });
  }, [
    columns,
    view.options?.hiddenOptions,
    view.options?.hideEmptyColumns,
    pendingRenameValue,
  ]);

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

  // Bring a just added column's heading into view, since new
  // columns land at the far end of the board.
  useEffect(() => {
    // Check that a column is awaiting its rename popover
    if (!pendingRenameValue) {
      return;
    }

    scrollRootRef.current
      ?.querySelector(
        `[data-kanban-column="${CSS.escape(pendingRenameValue)}"]`,
      )
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [pendingRenameValue]);

  // Persist the updated entry order to the view data
  const updateOrder = useCallback(
    (updatedOrder: KanbanOrder) => {
      DataViews.update(view.id, { data: { order: updatedOrder } });
    },
    [view.id],
  );

  // Persist a duplicated entry's placement directly below its
  // original. Until the placement is persisted, the column
  // resolution shows the duplicate there via its duplicatedFrom
  // reference.
  useEffect(() => {
    Events.addListener(
      DatabaseEntryDuplicatedEvent,
      `kanban-view-${view.id}`,
      (data) => {
        // Ignore duplications from other sources
        if (data.source?.id !== view.dataSource.id) {
          return;
        }

        // Locate the original's column
        const column = columns.find((candidate) =>
          candidate.entryIds.includes(data.original.id),
        );

        // Skip the placement if the original is not on the board
        if (!column) {
          return;
        }

        // Index into the column's saved order rather than its
        // rendered list, which also holds unplaced entries the
        // order does not. An unplaced original resolves to the
        // top, matching the display fallback.
        const originalIndex = (order[column.value] ?? []).indexOf(
          data.original.id,
        );

        updateOrder(
          placeEntryInColumn(
            order,
            data.duplicate.id,
            column.value,
            originalIndex + 1,
          ),
        );
      },
    );

    return () => {
      Events.removeListener(
        DatabaseEntryDuplicatedEvent,
        `kanban-view-${view.id}`,
      );
    };
  }, [view.id, view.dataSource.id, columns, order, updateOrder]);

  // Track the column or heading under the pointer, whose heading
  // shows its actions. Tracked in state rather than via :hover,
  // whose CSS state goes stale over scrolled content in WebKit,
  // and because the heading and its column body sit in separate
  // rows a plain :hover could not pair. Also fed by drag over
  // events, since mouse events do not fire while dragging cards.
  const handleBoardMouseMove = useCallback((event: React.MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;

    setHoveredColumnValue(
      target
        ?.closest('[data-kanban-column]')
        ?.getAttribute('data-kanban-column') ?? null,
    );
  }, []);

  // Clear the hovered column when the pointer leaves the board
  const handleBoardMouseLeave = useCallback(() => {
    setHoveredColumnValue(null);
  }, []);

  // Reorder the group property's options to match the dragged
  // headings, keeping hidden columns in place.
  const handleColumnSort = useCallback(
    (orderedValues: string[]) => {
      // Check that a group property resolved to write the order to
      if (!property || !databaseId) {
        return;
      }

      Databases.updateProperty(databaseId, {
        ...property,
        options: resolveReorderedOptions(
          property.options,
          orderedValues.filter((value) => value !== NO_VALUE_COLUMN),
        ),
      });
    },
    [property, databaseId],
  );

  // Rename a column's option, which also rewrites the value in
  // the entries holding it.
  const handleRenameColumn = useCallback(
    (value: string, newValue: string) => {
      // Check that a group property resolved to rename the option of
      if (!property || !databaseId) {
        return;
      }

      // Re-key the column's saved order optimistically, so its
      // card order holds while the rename settles. The option
      // renamed event re-keys other views over the database.
      if (order[value]) {
        updateOrder(
          Object.fromEntries(
            Object.entries(order).map(([orderValue, entryIds]) => [
              orderValue === value ? newValue : orderValue,
              entryIds,
            ]),
          ),
        );
      }

      Databases.renamePropertyOption(
        databaseId,
        property.name,
        value,
        newValue,
      );
    },
    [property, databaseId, order, updateOrder],
  );

  // Recolour a column's option
  const handleSetColumnColor = useCallback(
    (value: string, color: ContentColor) => {
      // Check that a group property resolved to recolour the option of
      if (!property || !databaseId) {
        return;
      }

      Databases.updateProperty(databaseId, {
        ...property,
        options: property.options.map((option) =>
          option.value === value ? { ...option, color } : option,
        ),
      });
    },
    [property, databaseId],
  );

  // Delete a column by removing its option from the group
  // property. Entries holding the value fall into the no-value
  // column.
  const handleDeleteColumn = useCallback(
    (value: string) => {
      // Check that a group property resolved to remove the option from
      if (!property || !databaseId) {
        return;
      }

      Databases.updateProperty(databaseId, {
        ...property,
        options: property.options.filter((option) => option.value !== value),
      });
    },
    [property, databaseId],
  );

  // Hide a column from the board
  const handleHideColumn = useCallback(
    (value: string) => {
      DataViews.updateOptions(view.id, {
        hiddenOptions: [...(view.options?.hiddenOptions ?? []), value],
      });
    },
    [view.id, view.options?.hiddenOptions],
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

  // Create an entry at the top of a column via its heading's new
  // entry button, giving it the column's group property value.
  const handleCreateColumnEntry = useCallback(
    async (columnValue: string) => {
      // Check that a group property resolved, since the column's
      // value is written to it.
      if (!property || !databaseId) {
        return;
      }

      // Give entries created in an option's column the option's
      // value from the start, so they never pass through the
      // no-value column.
      const columnProperties =
        columnValue !== NO_VALUE_COLUMN
          ? { [property.name]: applyColumnValue(null, property, columnValue) }
          : {};

      const entry = await DatabaseEntries.create(
        databaseId,
        undefined,
        columnProperties,
      );

      // Position the entry at the top of the column
      updateOrder(placeEntryInColumn(order, entry.id, columnValue, 0));

      // Autofocus the new entry's editor once its card mounts
      setAutoFocusEntryId(entry.id);

      // Bring the new entry's card into view if the column's top
      // sits off screen.
      scrollEntryIntoView(entry.id);

      // Check if the source is a collection. Collections list
      // their entries explicitly, unlike databases and queries.
      if (view.dataSource.type === 'collection') {
        await Collections.addItems(view.dataSource.id, [entry.id]);
      }
    },
    [
      property,
      databaseId,
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

  // Handle dropping an entry into a column
  const handleColumnDrop = useCallback(
    async (
      data: DropEventData,
      columnValue: string,
      targetEntryIndex: number,
    ) => {
      // Check that a group property is available to write the
      // column's value to
      if (!property) {
        return;
      }

      // The dropped entry, if any
      const [droppedEntryId] = getDroppedEntryIds(data);

      // Check that an entry was dropped
      if (!droppedEntryId) {
        return;
      }

      // Move the entry to the drop position, taking the column's
      // value.
      await moveEntryToColumn(
        droppedEntryId,
        property,
        columnValue,
        targetEntryIndex,
      );
    },
    [property, moveEntryToColumn],
  );

  // Render a column's heading with its sortable render props
  function renderColumnHeading(
    value: string,
    sortable: SortableItemRenderProps,
  ) {
    const column = visibleColumns.find(
      (candidate) => candidate.value === value,
    );

    // Check that the value still names a visible column
    if (!column) {
      return null;
    }

    return (
      <KanbanViewColumnHeading
        column={column}
        sortable={sortable}
        draggable={canManageColumns && value !== NO_VALUE_COLUMN}
        canManage={canManageColumns}
        canCreateEntry={canManageColumns && canCreateEntries}
        actionsVisible={hoveredColumnValue === value}
        existingValues={property?.options.map((option) => option.value)}
        autoOpenRename={pendingRenameValue === value}
        onRenameAutoOpened={clearPendingColumnRename}
        onRename={handleRenameColumn}
        onSetColor={handleSetColumnColor}
        onHide={handleHideColumn}
        onDelete={handleDeleteColumn}
        onCreateEntry={handleCreateColumnEntry}
      />
    );
  }

  // The classes styling the columns
  const columnClasses = resolveColumnClasses(view.options);

  // Whether the group property's options can be managed from the
  // board.
  const canManageColumns = Boolean(property && databaseId);

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
      viewportRef={scrollViewportRef}
      className="kanban-view-scroll"
      stateKey="content"
    >
      <Stack
        gap={0}
        className={`kanban-view ${columnClasses}`.trim()}
        onMouseMove={handleBoardMouseMove}
        onMouseLeave={handleBoardMouseLeave}
        onDragOver={handleBoardMouseMove}
      >
        {/** Column headings, draggable to reorder the options **/}
        <SortableList
          items={visibleColumns.map((column) => column.value)}
          direction="horizontal"
          gap={0}
          className="kanban-view-headings"
          onSort={handleColumnSort}
          renderItem={renderColumnHeading}
        />

        {/** Column bodies **/}
        <DatabaseEntryContextProvider
          draggable
          optionsMenu
          source={view.dataSource}
          autoFocusEntryId={autoFocusEntryId}
          onEntryAutoFocused={handleEntryAutoFocused}
        >
          <Group gap={4} align="stretch" className="kanban-view-columns">
            {visibleColumns.map((column) => (
              <KanbanViewColumn
                key={column.value}
                column={column}
                scroll={columnScroll}
                entryCardLayouts={entryCardLayouts}
                onDrop={handleColumnDrop}
              />
            ))}
          </Group>
        </DatabaseEntryContextProvider>
      </Stack>
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
