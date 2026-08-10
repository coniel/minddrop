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
  CanvasConnectionReconnection,
  CanvasConnectionsLayer,
  CanvasNode,
  CanvasNodeConnection,
  CanvasPoint,
  CanvasProvider,
  CanvasToolbar,
  useCanvas,
  useCanvasStore,
  useFitOnNodesReady,
} from '@minddrop/ui-canvas';
import {
  DataViewEntryPicker,
  DataViewFloatingToolbar,
  DataViewNewEntryPicker,
} from '@minddrop/ui-databases';
import { getTransferData, uuid } from '@minddrop/utils';
import {
  CanvasConnectionChanges,
  CanvasConnectionToolbar,
} from '../CanvasConnectionToolbar';
import {
  CANVAS_ACCEPTED_DATA_TYPES,
  CONNECTION_TOOLBAR_EXIT_DURATION,
  DEFAULT_NODE_WIDTH,
  ESTIMATED_NODE_HEIGHT,
  NODE_GAP,
} from '../constants';
import {
  CanvasViewConnection,
  CanvasViewData,
  CanvasViewNode,
  CanvasViewOptions,
} from '../types';
import {
  placeEntryNode,
  reconcileConnections,
  reconcileNodes,
  updateNodeFrame,
} from '../utils';
import './CanvasView.css';

interface ConnectionSelection {
  /**
   * The ID of the selected connection.
   */
  connectionId: string;

  /**
   * The canvas point the connection was selected at, anchoring
   * the connection toolbar.
   */
  point: CanvasPoint;
}

interface ToolbarSelection {
  /**
   * The connection the toolbar configures.
   */
  connection: CanvasViewConnection;

  /**
   * The canvas point anchoring the toolbar.
   */
  point: CanvasPoint;

  /**
   * Whether the toolbar is shown. False while its exit transition
   * plays before unmounting.
   */
  open: boolean;
}

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
  <CanvasProvider initialSnapToGrid={view.options?.snapToGrid}>
    <CanvasViewContent view={view} entries={entries} />
  </CanvasProvider>
);

/**
 * Renders the canvas view's canvas, nodes, connections, pickers
 * and toolbars. Separated from the root component so it can use
 * the canvas context provided there.
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

  // The selected connection and the canvas point it was selected
  // at, anchoring the connection toolbar. Deletable via
  // Delete/Backspace.
  const [connectionSelection, setConnectionSelection] =
    useState<ConnectionSelection | null>(null);

  // The toolbar's displayed selection, kept mounted while its
  // exit transition plays after deselection
  const [toolbarSelection, setToolbarSelection] =
    useState<ToolbarSelection | null>(null);

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

  // Resolve connections from view data, falling back to none
  const connections = useMemo(() => view.data?.connections || [], [view.data]);

  // Reconcile the saved connections with the reconciled nodes,
  // dropping connections attached to removed nodes
  const reconciledConnections = useMemo(
    () => reconcileConnections(connections, reconciledNodes),
    [connections, reconciledNodes],
  );

  // The selected connection, when it still exists
  const selectedConnection = useMemo(
    () =>
      reconciledConnections.find(
        (connection) => connection.id === connectionSelection?.connectionId,
      ) || null,
    [reconciledConnections, connectionSelection],
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

  // Canvas actions for converting selection clicks to canvas
  // coordinates
  const canvas = useCanvas();

  // Whether a drag-to-connect or re-connect interaction is in
  // progress
  const connectionDragActive = useCanvasStore((state) =>
    Boolean(state.connectionDrag),
  );

  // Whether node interactions snap to the grid, toggled from the
  // canvas settings menu
  const snapToGrid = useCanvasStore((state) => state.snapToGrid);

  // Fit the placed nodes into view when the canvas opens
  useFitOnNodesReady(reconciledNodes.map((node) => node.id));

  // Persist the updated nodes to the view data
  const updateNodes = useCallback(
    (updatedNodes: CanvasViewNode[]) => {
      DataViews.update(view.id, { data: { nodes: updatedNodes } });
    },
    [view.id],
  );

  // Persist the updated connections to the view data
  const updateConnections = useCallback(
    (updatedConnections: CanvasViewConnection[]) => {
      DataViews.update(view.id, { data: { connections: updatedConnections } });
    },
    [view.id],
  );

  // Add a connection dragged between two nodes, skipping exact
  // duplicates
  const handleConnect = useCallback(
    (connection: CanvasNodeConnection) => {
      // An identical connection already exists
      const duplicate = reconciledConnections.some(
        (existing) =>
          existing.from.nodeId === connection.from.nodeId &&
          existing.from.side === connection.from.side &&
          existing.to.nodeId === connection.to.nodeId &&
          existing.to.side === connection.to.side,
      );

      if (duplicate) {
        return;
      }

      updateConnections([
        ...reconciledConnections,
        { id: uuid(), from: connection.from, to: connection.to },
      ]);
    },
    [reconciledConnections, updateConnections],
  );

  // Select a connection when its curve is pressed, anchoring the
  // connection toolbar at the pressed point
  const handleConnectionMouseDown = useCallback(
    (connectionId: string, event: React.MouseEvent) => {
      setConnectionSelection({
        connectionId,
        point: canvas.clientToCanvas({
          x: event.clientX,
          y: event.clientY,
        }),
      });
    },
    [canvas],
  );

  // Deselect the connection on any press outside the connection
  // toolbar and its menus. Window-level capture, since an open
  // menu swallows the outside press that dismisses it before it
  // reaches the canvas.
  useEffect(() => {
    if (!connectionSelection) {
      return;
    }

    const handleWindowPointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;

      // Ignore presses within the toolbar or an open menu
      if (
        target?.closest('.canvas-view-connection-toolbar') ||
        target?.closest('.menu')
      ) {
        return;
      }

      setConnectionSelection(null);
    };

    window.addEventListener('pointerdown', handleWindowPointerDown, true);

    return () => {
      window.removeEventListener('pointerdown', handleWindowPointerDown, true);
    };
  }, [connectionSelection]);

  // Show the toolbar for the selected connection, playing its
  // exit transition before unmounting it on deselection
  useEffect(() => {
    // Show the toolbar for the current selection
    if (selectedConnection && connectionSelection) {
      setToolbarSelection({
        connection: selectedConnection,
        point: connectionSelection.point,
        open: true,
      });

      return;
    }

    // Start the exit transition
    setToolbarSelection((current) =>
      current?.open ? { ...current, open: false } : current,
    );

    // Unmount once the exit transition has played
    const timeout = window.setTimeout(
      () => setToolbarSelection(null),
      CONNECTION_TOOLBAR_EXIT_DURATION,
    );

    return () => window.clearTimeout(timeout);
  }, [selectedConnection, connectionSelection]);

  // Persist the canvas's snap to grid setting when it is toggled
  useEffect(() => {
    // The setting matches what is saved, nothing to persist
    if (snapToGrid === Boolean(view.options?.snapToGrid)) {
      return;
    }

    DataViews.update(view.id, { options: { snapToGrid } });
  }, [snapToGrid, view.id, view.options?.snapToGrid]);

  // Deselect the connection when a connection drag starts, so the
  // toolbar does not linger over the drag
  useEffect(() => {
    if (connectionDragActive) {
      setConnectionSelection(null);
    }
  }, [connectionDragActive]);

  // Re-route a connection end dragged onto a new target, skipping
  // changes that would duplicate an existing connection. Ends
  // dropped on empty canvas remove the connection.
  const handleConnectionReconnect = useCallback(
    (reconnection: CanvasConnectionReconnection) => {
      const { target } = reconnection;

      // Dropped on empty canvas: remove the connection
      if (!target) {
        updateConnections(
          reconciledConnections.filter(
            (connection) => connection.id !== reconnection.connectionId,
          ),
        );

        return;
      }

      // Replace the dragged end on the re-routed connection
      const updated = reconciledConnections.map((connection) => {
        // Leave other connections untouched
        if (connection.id !== reconnection.connectionId) {
          return connection;
        }

        // Replace the dragged end with its new target
        if (reconnection.end === 'from') {
          return { ...connection, from: target };
        }

        return { ...connection, to: target };
      });

      const rerouted = updated.find(
        (connection) => connection.id === reconnection.connectionId,
      );

      // The re-routed connection no longer exists
      if (!rerouted) {
        return;
      }

      // An identical connection already exists; drop the change
      const duplicate = updated.some(
        (connection) =>
          connection.id !== rerouted.id &&
          connection.from.nodeId === rerouted.from.nodeId &&
          connection.from.side === rerouted.from.side &&
          connection.to.nodeId === rerouted.to.nodeId &&
          connection.to.side === rerouted.to.side,
      );

      if (duplicate) {
        return;
      }

      updateConnections(updated);
    },
    [reconciledConnections, updateConnections],
  );

  // Apply configuration changes to the selected connection
  const handleConnectionChange = useCallback(
    (changes: CanvasConnectionChanges) => {
      updateConnections(
        reconciledConnections.map((connection) =>
          connection.id === connectionSelection?.connectionId
            ? { ...connection, ...changes }
            : connection,
        ),
      );
    },
    [reconciledConnections, connectionSelection, updateConnections],
  );

  // Remove the selected connection and clear the selection
  const deleteSelectedConnection = useCallback(() => {
    // No connection is selected
    if (!connectionSelection) {
      return;
    }

    // Filter the selected connection out of the persisted set
    updateConnections(
      reconciledConnections.filter(
        (connection) => connection.id !== connectionSelection.connectionId,
      ),
    );
    setConnectionSelection(null);
  }, [connectionSelection, reconciledConnections, updateConnections]);

  // Handle connection keyboard shortcuts bubbling up from the
  // canvas: Escape deselects, Delete/Backspace removes the
  // selected connection
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tag = target.tagName;

      // Don't handle shortcuts when typing in inputs
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Escape deselects the connection
      if (event.key === 'Escape' && connectionSelection) {
        setConnectionSelection(null);

        return;
      }

      // Delete/Backspace removes the selected connection. Stopped
      // from propagating so the app's global delete-selection
      // shortcut never sees it.
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        connectionSelection
      ) {
        event.preventDefault();
        event.stopPropagation();

        deleteSelectedConnection();
      }
    },
    [connectionSelection, deleteSelectedConnection],
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
    <div
      className="canvas-view data-view-floating-toolbar-host"
      onKeyDown={handleKeyDown}
    >
      <Canvas
        shortcutScope="focus"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Connection curves, rendered below the nodes */}
        <CanvasConnectionsLayer
          connections={reconciledConnections}
          selectedId={connectionSelection?.connectionId}
          onConnectionMouseDown={handleConnectionMouseDown}
          onConnectionReconnect={handleConnectionReconnect}
        />

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
              connectable
              className="canvas-view-node"
              onConnect={handleConnect}
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

      {/* Selected connection configuration toolbar */}
      {toolbarSelection && (
        <CanvasConnectionToolbar
          connection={toolbarSelection.connection}
          point={toolbarSelection.point}
          open={toolbarSelection.open}
          onConnectionChange={handleConnectionChange}
          onConnectionDelete={deleteSelectedConnection}
        />
      )}

      {/* Floating toolbar */}
      <DataViewFloatingToolbar
        databaseCards={toolbarDatabaseCards}
        menuOpen={optionsMenuOpen}
      >
        {/* View settings menu */}
        <DataViewOptionsMenu view={view} onOpenChange={setOptionsMenuOpen} />
      </DataViewFloatingToolbar>

      {/* Zoom controls */}
      <CanvasToolbar />
    </div>
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
