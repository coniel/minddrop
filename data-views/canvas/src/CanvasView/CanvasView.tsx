import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Collections } from '@minddrop/collections';
import { DataViewTypeComponentProps, DataViews } from '@minddrop/data-views';
import {
  DatabaseEntries,
  DatabaseEntryDuplicatedEvent,
  DatabaseEntryDuplicatedEventData,
  DatabaseId,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DataViewOptionsMenu } from '@minddrop/feature-data-views';
import {
  DatabaseEntryContextProvider,
  DatabaseEntryRenderer,
  dropContainsAddExistingEntryCard,
  dropContainsNewEntryPickerCard,
  getDroppedEntryIds,
  getDroppedNewEntryDatabaseIds,
} from '@minddrop/feature-databases';
import { DropEventData, dragContainsType } from '@minddrop/selection';
import {
  Canvas,
  CanvasNode,
  CanvasPoint,
  CanvasProvider,
  CanvasZoomToolbar,
  useFitOnNodesReady,
} from '@minddrop/ui-canvas';
import {
  DataViewEntryPicker,
  DataViewFloatingToolbar,
  DataViewNewEntryPicker,
} from '@minddrop/ui-databases';
import { getTransferData } from '@minddrop/utils';
import {
  CANVAS_ACCEPTED_DATA_TYPES,
  DEFAULT_NODE_WIDTH,
  ESTIMATED_NODE_HEIGHT,
  NODE_GAP,
} from '../constants';
import { CanvasViewData, CanvasViewNode, CanvasViewOptions } from '../types';
import { placeEntryNode, reconcileNodes, updateNodeFrame } from '../utils';
import './CanvasView.css';

interface EntryPickerState {
  /**
   * The picker to render: an existing entry picker or a new
   * entry picker.
   */
  type: 'existing' | 'new';

  /**
   * The picker's horizontal position in canvas coordinates.
   */
  x: number;

  /**
   * The picker's vertical position in canvas coordinates.
   */
  y: number;
}

/**
 * Renders a canvas view: an infinite pannable/zoomable canvas
 * with freely arranged entry cards.
 */
export const CanvasViewComponent: React.FC<
  DataViewTypeComponentProps<CanvasViewOptions, CanvasViewData>
> = ({ view, entries }) => (
  <div className="canvas-view data-view-floating-toolbar-host">
    <CanvasProvider>
      <CanvasViewContent view={view} entries={entries} />
    </CanvasProvider>
  </div>
);

/**
 * Renders the canvas view's canvas, nodes, pickers and toolbar.
 * Separated from the root component so it can use the canvas
 * context provided there.
 */
const CanvasViewContent: React.FC<
  DataViewTypeComponentProps<CanvasViewOptions, CanvasViewData>
> = ({ view, entries }) => {
  // The active entry picker, spawned by dropping the add existing
  // entry or new entry card
  const [entryPicker, setEntryPicker] = useState<EntryPickerState | null>(null);

  // Whether the view options menu is open, pinning the floating
  // toolbar in place
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);

  // Resolve nodes from view data, falling back to an empty canvas
  const nodes = useMemo(() => view.data?.nodes || [], [view.data]);

  // Reconcile the saved nodes with the current entries from the
  // collection. Entries added to the collection but not yet
  // placed get auto-placed positions. Nodes of entries removed
  // from the collection are filtered out.
  const reconciledNodes = useMemo(
    () => reconcileNodes(nodes, entries),
    [nodes, entries],
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

  // Derive a toolbar card for each database the canvas's entries
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

  // Fit the placed nodes into view when the canvas opens
  useFitOnNodesReady(reconciledNodes.map((node) => node.id));

  // Persist the updated nodes to the view data
  const updateNodes = useCallback(
    (updatedNodes: CanvasViewNode[]) => {
      DataViews.update(view.id, { data: { nodes: updatedNodes } });
    },
    [view.id],
  );

  // Place duplicated entries next to their original. Fired before
  // the duplicate is added to the collection, so placing it now
  // keeps it from being reconciled into the auto-placed grid.
  useEffect(() => {
    Events.addListener<DatabaseEntryDuplicatedEventData>(
      DatabaseEntryDuplicatedEvent,
      `canvas-view-${view.id}`,
      ({ data }) => {
        // Ignore duplications from other sources
        if (data.source?.id !== view.dataSource.id) {
          return;
        }

        const original = reconciledNodes.find(
          (node) => node.type === 'entry' && node.id === data.original.id,
        );

        // Skip the update if the original is not on the canvas
        if (!original) {
          return;
        }

        // Place the duplicate directly below the original
        updateNodes(
          placeEntryNode(reconciledNodes, data.duplicate.id, {
            x: original.x + original.width / 2,
            y:
              original.y +
              (original.height ?? ESTIMATED_NODE_HEIGHT) +
              NODE_GAP,
          }),
        );
      },
    );

    return () => {
      Events.removeListener(
        DatabaseEntryDuplicatedEvent,
        `canvas-view-${view.id}`,
      );
    };
  }, [view.id, view.dataSource.id, reconciledNodes, updateNodes]);

  // Create an entry in the given database, optionally from an
  // entry template, place it on the canvas, and add it to the
  // canvas's collection
  const createEntry = useCallback(
    async (databaseId: DatabaseId, point: CanvasPoint, templateId?: string) => {
      // Create from the template when one is picked
      const entry = templateId
        ? await DatabaseEntries.createFromTemplate(databaseId, templateId)
        : await DatabaseEntries.create(databaseId);

      // Place the entry before adding it to the collection, otherwise
      // it is briefly reconciled into the auto-placed grid
      updateNodes(placeEntryNode(reconciledNodes, entry.id, point));

      await Collections.addItems(view.dataSource.id, [entry.id]);
    },
    [view.dataSource.id, reconciledNodes, updateNodes],
  );

  // Allow dragging accepted data types over the canvas
  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (dragContainsType(event, CANVAS_ACCEPTED_DATA_TYPES)) {
      event.preventDefault();
    }
  }, []);

  // Handle dropping an entry, new entry card, or picker card onto
  // the canvas
  const handleDrop = useCallback(
    async (event: React.DragEvent, canvasPoint: CanvasPoint) => {
      event.preventDefault();

      // Parse the drop into the shared drop event data shape
      const data: DropEventData = {
        event,
        targetType: 'canvas-view',
        targetId: view.id,
        position: 'inside',
        data: getTransferData(event),
      };

      // Picker cards spawn their picker at the drop position
      const pickerType = droppedPickerType(data);

      if (pickerType) {
        setEntryPicker({
          type: pickerType,
          x: Math.round(canvasPoint.x - DEFAULT_NODE_WIDTH / 2),
          y: Math.round(canvasPoint.y),
        });

        return;
      }

      // Existing entries are placed at the drop position
      const [droppedEntryId] = getDroppedEntryIds(data);

      if (droppedEntryId) {
        updateNodes(
          placeEntryNode(reconciledNodes, droppedEntryId, canvasPoint),
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
        canvasPoint,
        toolbarCardTemplateId(view.options, databaseId),
      );
    },
    [view.id, view.options, reconciledNodes, updateNodes, createEntry],
  );

  // The picker's placement point: the canvas point its card
  // would be centered on
  const pickerPoint = useCallback(
    (picker: EntryPickerState): CanvasPoint => ({
      x: picker.x + DEFAULT_NODE_WIDTH / 2,
      y: picker.y,
    }),
    [],
  );

  // Place a picked entry at the picker position and add it to
  // the canvas's collection
  const addPickedEntry = useCallback(
    async (entryId: string, picker: EntryPickerState) => {
      // Place the entry before adding it to the collection, otherwise
      // it is briefly reconciled into the auto-placed grid
      updateNodes(
        placeEntryNode(reconciledNodes, entryId, pickerPoint(picker)),
      );

      await Collections.addItems(view.dataSource.id, [entryId]);
    },
    [reconciledNodes, updateNodes, pickerPoint, view.dataSource.id],
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
  // entry lands at the picker position, moving the picker down
  const handleEntryPickerSecondarySelect = useCallback(
    async (entryId: string) => {
      if (!entryPicker) {
        return;
      }

      setEntryPicker({
        ...entryPicker,
        y: entryPicker.y + ESTIMATED_NODE_HEIGHT + NODE_GAP,
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

      await createEntry(databaseId, pickerPoint(entryPicker), templateId);
    },
    [entryPicker, createEntry, pickerPoint],
  );

  // Handle picking a database while keeping the picker open: the
  // new entry lands at the picker position, moving the picker down
  const handleNewEntryPickerSecondarySelect = useCallback(
    async (databaseId: DatabaseId, templateId?: string) => {
      if (!entryPicker) {
        return;
      }

      setEntryPicker({
        ...entryPicker,
        y: entryPicker.y + ESTIMATED_NODE_HEIGHT + NODE_GAP,
      });

      await createEntry(databaseId, pickerPoint(entryPicker), templateId);
    },
    [entryPicker, createEntry, pickerPoint],
  );

  // Handle dismissing the picker without a selection
  const handleEntryPickerDismiss = useCallback(() => {
    setEntryPicker(null);
  }, []);

  // Render the active picker at its canvas position
  function renderEntryPicker() {
    if (!entryPicker) {
      return null;
    }

    return (
      <div
        className="canvas-view-picker"
        style={{
          transform: `translate(${entryPicker.x}px, ${entryPicker.y}px)`,
          width: DEFAULT_NODE_WIDTH,
        }}
      >
        {entryPicker.type === 'new' ? (
          <DataViewNewEntryPicker
            onSelect={handleNewEntryPickerSelect}
            onSecondarySelect={handleNewEntryPickerSecondarySelect}
            onDismiss={handleEntryPickerDismiss}
          />
        ) : (
          <DataViewEntryPicker
            excludeIds={entries}
            onSelect={handleEntryPickerSelect}
            onSecondarySelect={handleEntryPickerSecondarySelect}
            onDismiss={handleEntryPickerDismiss}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Canvas
        shortcutScope="focus"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <DatabaseEntryContextProvider optionsMenu source={view.dataSource}>
          {reconciledNodes.map((node) => (
            <CanvasNode
              key={node.id}
              id={node.id}
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              resizeEdges="horizontal"
              dragMode="handle"
              className="canvas-view-node"
              onFrameChange={(frame) =>
                updateNodes(updateNodeFrame(reconciledNodes, node.id, frame))
              }
            >
              <DatabaseEntryRenderer
                entryId={node.id}
                layoutContext="card"
                layoutId={entryCardLayouts[node.id]}
              />
            </CanvasNode>
          ))}
        </DatabaseEntryContextProvider>

        {/* Active entry picker */}
        {renderEntryPicker()}
      </Canvas>

      {/* Floating toolbar */}
      <DataViewFloatingToolbar
        databaseCards={toolbarDatabaseCards}
        menuOpen={optionsMenuOpen}
      >
        {/* View settings menu */}
        <DataViewOptionsMenu view={view} onOpenChange={setOptionsMenuOpen} />
      </DataViewFloatingToolbar>

      {/* Zoom controls */}
      <CanvasZoomToolbar className="canvas-view-zoom-toolbar" />
    </>
  );
};

// Resolve the entry template configured for a database's toolbar
// card, ignoring templates which no longer exist
function toolbarCardTemplateId(
  options: Partial<CanvasViewOptions> | undefined,
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
