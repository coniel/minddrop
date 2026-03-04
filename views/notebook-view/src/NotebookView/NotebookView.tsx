import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Databases } from '@minddrop/databases';
import { DatabaseEntryRenderer } from '@minddrop/feature-databases';
import {
  CreateDatabaseEntryButton,
  DatabaseEntriesSearchField,
} from '@minddrop/ui-components';
import { ScrollArea } from '@minddrop/ui-primitives';
import { ViewTypeComponentProps, Views } from '@minddrop/views';
import { defaultNotebookViewOptions } from '../constants';
import { NotebookViewOptions } from '../types';
import { useListPanelResize } from '../useListPanelResize';
import './NotebookView.css';

/**
 * Renders a split-panel notebook layout with a resizable entry list
 * on the left and the selected entry's page design on the right.
 */
export const NotebookViewComponent: React.FC<
  ViewTypeComponentProps<NotebookViewOptions>
> = ({ view, entries }) => {
  // Resolve the list column width from the view options
  const initialWidth = useMemo(
    () =>
      view.options?.listColumnWidth ||
      defaultNotebookViewOptions.listColumnWidth,
    [view.options?.listColumnWidth],
  );

  // Track the filtered entries from the search field
  const [filteredEntries, setFilteredEntries] = useState<string[]>(entries);

  // Track which entry is currently selected
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Auto-select the first entry if nothing is selected or if
  // the selected entry is no longer in the filtered list
  useEffect(() => {
    if (selectedEntryId && filteredEntries.includes(selectedEntryId)) {
      return;
    }

    setSelectedEntryId(filteredEntries[0] ?? null);
  }, [filteredEntries, selectedEntryId]);

  // Persist the new width to the view options when resizing ends
  const handleResizeEnd = useCallback(
    (width: number) => {
      Views.update(view.id, { options: { listColumnWidth: width } });
    },
    [view.id],
  );

  const { width, isDragging, startResize } = useListPanelResize({
    initialWidth,
    onResizeEnd: handleResizeEnd,
  });

  // Handle clicking a list item to select it
  const handleEntryClick = useCallback((entryId: string) => {
    setSelectedEntryId(entryId);
  }, []);

  // Select the newly created entry
  const handleCreateEntry = useCallback((entry: { id: string }) => {
    setSelectedEntryId(entry.id);
  }, []);

  // Resolve the database ID(s) for the create button. If the
  // data source is a database, use it directly. Otherwise,
  // derive the databases from the current entries.
  const createDatabaseIds = useMemo(() => {
    if (view.dataSource.type === 'database') {
      return view.dataSource.id;
    }

    return Databases.getFromEntries(entries).map((database) => database.id);
  }, [view.dataSource, entries]);

  return (
    <div className="notebook-view" data-dragging={isDragging || undefined}>
      {/* List panel */}
      <div className="notebook-view-list-panel" style={{ width }}>
        {/* Search bar and create button */}
        <div className="notebook-view-toolbar">
          <DatabaseEntriesSearchField
            entryIds={entries}
            onFilteredEntriesChange={setFilteredEntries}
            size="md"
          />
          <CreateDatabaseEntryButton
            database={createDatabaseIds}
            onCreateEntry={handleCreateEntry}
            size="md"
            variant="subtle"
          />
        </div>

        <ScrollArea className="notebook-view-list-scroll">
          {filteredEntries.map((entryId) => (
            <div
              key={entryId}
              className="notebook-view-list-item"
              data-selected={entryId === selectedEntryId || undefined}
            >
              <DatabaseEntryRenderer
                entryId={entryId}
                designType="list"
                onClick={handleEntryClick}
              />
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Resize handle */}
      <div className="notebook-view-resize-handle" onMouseDown={startResize}>
        <div className="notebook-view-resize-indicator" />
      </div>

      {/* Page panel */}
      <div className="notebook-view-page-panel">
        {selectedEntryId && (
          <DatabaseEntryRenderer
            key={selectedEntryId}
            entryId={selectedEntryId}
            designType="page"
          />
        )}
      </div>
    </div>
  );
};
