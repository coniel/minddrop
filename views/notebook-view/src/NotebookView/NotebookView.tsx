import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseEntryRenderer } from '@minddrop/feature-databases';
import {
  CreateDatabaseEntryButton,
  DatabaseEntriesSearchField,
} from '@minddrop/ui-components';
import { ScrollArea } from '@minddrop/ui-primitives';
import { ViewTypeComponentProps, Views } from '@minddrop/views';
import { defaultNotebookViewOptions } from '../constants';
import { NotebookViewDesignOverride, NotebookViewOptions } from '../types';
import { useListPanelResize } from '../useListPanelResize';
import './NotebookView.css';

/**
 * Renders a split-panel notebook layout with a resizable entry list
 * on the left and the selected entry's page design on the right.
 */
export const NotebookViewComponent: React.FC<
  ViewTypeComponentProps<NotebookViewOptions>
> = ({ view, entries }) => {
  // Track the filtered entries from the search field
  const [filteredEntries, setFilteredEntries] = useState<string[]>(entries);

  // Track which entry is currently selected
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Resolve the list column width from the view options
  const initialWidth = useMemo(
    () =>
      view.options?.listColumnWidth ||
      defaultNotebookViewOptions.listColumnWidth,
    [view.options?.listColumnWidth],
  );

  // Resolve the database ID(s) for the create button. If the
  // data source is a database, use it directly. Otherwise,
  // derive the databases from the current entries.
  const createDatabaseIds = useMemo(() => {
    if (view.dataSource.type === 'database') {
      return view.dataSource.id;
    }

    return Databases.getFromEntries(entries).map((database) => database.id);
  }, [view.dataSource, entries]);

  // Build a per-entry design override map from view options.
  // For database sources all entries share the same override,
  // for collections each entry's database is looked up.
  const entryDesignOverrides = useMemo(
    () =>
      resolveEntryDesignOverrides(
        entries,
        view.dataSource,
        view.options?.designOverrides,
      ),
    [entries, view.dataSource, view.options?.designOverrides],
  );

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

  // Auto-select the first entry if nothing is selected or if
  // the selected entry is no longer in the filtered list
  useEffect(() => {
    if (selectedEntryId && filteredEntries.includes(selectedEntryId)) {
      return;
    }

    setSelectedEntryId(filteredEntries[0] ?? null);
  }, [filteredEntries, selectedEntryId]);

  // Handle clicking a list item to select it
  const handleEntryClick = useCallback((entryId: string) => {
    setSelectedEntryId(entryId);
  }, []);

  // Select the newly created entry
  const handleCreateEntry = useCallback((entry: { id: string }) => {
    setSelectedEntryId(entry.id);
  }, []);

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
                designId={entryDesignOverrides[entryId]?.listDesignId}
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
            designId={entryDesignOverrides[selectedEntryId]?.pageDesignId}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Resolves per-entry design overrides from the view's design
 * override options. For database sources all entries share the
 * same database so a single lookup suffices. For collection or
 * query sources, each entry's database is resolved individually.
 */
function resolveEntryDesignOverrides(
  entries: string[],
  dataSource: { type: string; id: string },
  designOverrides?: Record<string, NotebookViewDesignOverride>,
): Record<string, NotebookViewDesignOverride> {
  if (!designOverrides) {
    return {};
  }

  const result: Record<string, NotebookViewDesignOverride> = {};

  // For database data sources all entries belong to the same database
  if (dataSource.type === 'database') {
    const override = designOverrides[dataSource.id];

    if (!override) {
      return result;
    }

    for (const entryId of entries) {
      result[entryId] = override;
    }

    return result;
  }

  // For collection/query sources, look up each entry's database
  for (const entryId of entries) {
    try {
      const entry = DatabaseEntries.get(entryId);
      const override = designOverrides[entry.database];

      if (override) {
        result[entryId] = override;
      }
    } catch {
      // Entry not found, skip
    }
  }

  return result;
}
