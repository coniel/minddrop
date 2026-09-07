import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataViewTypeComponentProps, DataViews } from '@minddrop/data-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseEntryRenderer } from '@minddrop/feature-databases';
import { AddCollectionEntryButton } from '@minddrop/ui-components';
import { DataViewSortMenu } from '@minddrop/ui-data-views';
import {
  CreateDatabaseEntryButton,
  DatabaseEntriesSearchField,
} from '@minddrop/ui-databases';
import {
  ScrollArea,
  TransientViewStateScope,
  VirtualizedList,
  useTransientState,
} from '@minddrop/ui-primitives';
import {
  LIST_ITEM_HEIGHT_ESTIMATE,
  defaultNotebookViewOptions,
} from '../constants';
import { NotebookViewOptions } from '../types';
import { useListPanelResize } from '../useListPanelResize';
import './NotebookView.css';

/**
 * Renders a split-panel notebook layout with a resizable entry list
 * on the left and the selected entry's page design on the right.
 */
export const NotebookViewComponent: React.FC<
  DataViewTypeComponentProps<NotebookViewOptions>
> = ({ view, entries }) => {
  // Track the filtered entries from the search field
  const [filteredEntries, setFilteredEntries] = useState<string[]>(entries);

  // Track which entry is currently selected, persisted per tab
  const [selectedEntryId, setSelectedEntryId] = useTransientState<
    string | null
  >('selectedEntry', null);

  // Resolve the list column width from the view options
  const initialWidth = useMemo(
    () =>
      view.options?.listColumnWidth ||
      defaultNotebookViewOptions.listColumnWidth,
    [view.options?.listColumnWidth],
  );

  // The databases the notebook's entries belong to
  const entryDatabases = Databases.useFromEntries(entries);

  // Resolve the database ID(s) for the create button. If the
  // data source is a database, use it directly. Otherwise,
  // derive the databases from the current entries.
  const createDatabaseIds = useMemo(() => {
    if (view.dataSource.type === 'database') {
      return view.dataSource.id;
    }

    return entryDatabases.map((database) => database.id);
  }, [view.dataSource, entryDatabases]);

  // Build a per-entry layout override map from view options
  const entryLayoutOverrides = useMemo(
    () =>
      DatabaseEntries.resolveLayoutOverrides(
        entries,
        view.options?.layoutOverrides,
      ),
    [entries, view.options?.layoutOverrides],
  );

  // The selected entry's row index, kept scrolled into view
  const selectedEntryIndex = useMemo(
    () => (selectedEntryId ? filteredEntries.indexOf(selectedEntryId) : -1),
    [filteredEntries, selectedEntryId],
  );

  // Persist the new width to the view options when resizing ends
  const handleResizeEnd = useCallback(
    (width: number) => {
      DataViews.updateOptions(view.id, { listColumnWidth: width });
    },
    [view.id],
  );

  const { width, isDragging, startResize } = useListPanelResize({
    initialWidth,
    onResizeEnd: handleResizeEnd,
  });

  // Auto-select the first entry if nothing is selected or if
  // the selected entry is no longer in the filtered list.
  useEffect(() => {
    if (selectedEntryId && filteredEntries.includes(selectedEntryId)) {
      return;
    }

    setSelectedEntryId(filteredEntries[0] ?? null);
  }, [filteredEntries, selectedEntryId, setSelectedEntryId]);

  // Handle clicking a list item to select it
  const handleEntryClick = useCallback(
    (entryId: string) => {
      setSelectedEntryId(entryId);
    },
    [setSelectedEntryId],
  );

  // Select the newly created or added entry
  const handleEntryAdded = useCallback(
    (entry: { id: string }) => {
      setSelectedEntryId(entry.id);
    },
    [setSelectedEntryId],
  );

  // Renders a list row for an entry
  const renderListItem = useCallback(
    (entryId: string) => (
      <div
        className="notebook-view-list-item"
        data-selected={entryId === selectedEntryId || undefined}
      >
        <DatabaseEntryRenderer
          entryId={entryId}
          layoutContext="navigation-list"
          layoutId={entryLayoutOverrides[entryId]?.listLayoutId}
          onClick={handleEntryClick}
        />
      </div>
    ),
    [selectedEntryId, entryLayoutOverrides, handleEntryClick],
  );

  return (
    <div className="notebook-view" data-dragging={isDragging || undefined}>
      {/* List panel */}
      <div className="notebook-view-list-panel" style={{ width }}>
        {/* Search bar and create button */}
        <div className="notebook-view-toolbar">
          <DatabaseEntriesSearchField
            entryIds={entries}
            onFilteredEntriesChange={setFilteredEntries}
            stateKey="search"
            size="md"
            variant="ghost"
          />

          {/* Entry sort dropdown */}
          <DataViewSortMenu view={view} size="md" variant="ghost" />

          {/* Collection sources also support adding existing entries */}
          {view.dataSource.type === 'collection' ? (
            <AddCollectionEntryButton
              collectionId={view.dataSource.id}
              database={false}
              onCreateEntry={handleEntryAdded}
              onAddEntry={handleEntryAdded}
              size="md"
              variant="ghost"
            />
          ) : (
            <CreateDatabaseEntryButton
              database={createDatabaseIds}
              onCreateEntry={handleEntryAdded}
              size="md"
              variant="ghost"
            />
          )}
        </div>

        {/* Rows are user designed layouts of varying height, so
            they are measured rather than fixed */}
        <VirtualizedList
          items={filteredEntries}
          itemHeight={LIST_ITEM_HEIGHT_ESTIMATE}
          itemKey={getListItemKey}
          measure
          renderItem={renderListItem}
          scrollToIndex={selectedEntryIndex}
          visibility="hover"
          stateKey="list"
          className="notebook-view-list-scroll"
        />
      </div>

      {/* Resize handle */}
      <div className="notebook-view-resize-handle" onMouseDown={startResize}>
        <div className="notebook-view-resize-indicator" />
      </div>

      {/* Page panel */}
      <div className="notebook-view-page-panel">
        {/* Scoped per entry so each one keeps its own scroll position */}
        {selectedEntryId && (
          <TransientViewStateScope segment={selectedEntryId}>
            <ScrollArea
              className="notebook-view-page-scroll"
              stateKey="page"
              endPadding="lg"
            >
              <DatabaseEntryRenderer
                key={selectedEntryId}
                entryId={selectedEntryId}
                layoutContext="page"
                layoutId={entryLayoutOverrides[selectedEntryId]?.pageLayoutId}
              />
            </ScrollArea>
          </TransientViewStateScope>
        )}
      </div>
    </div>
  );
};

/**
 * Returns the entry ID as the row key.
 */
function getListItemKey(entryId: string): string {
  return entryId;
}
