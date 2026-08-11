import { useCallback, useEffect, useMemo, useState } from 'react';
import { Databases } from '@minddrop/databases';
import {
  Queries,
  QueryNode,
  QueryNodeType,
  addQueryConnection,
  createQueryNode,
  removeQueryConnection,
  removeQueryNode,
  removeQueryNodeConnections,
  updateQueryNode,
} from '@minddrop/queries';
import { dragContainsType, toMimeType } from '@minddrop/selection';
import {
  Canvas,
  CanvasConnection,
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasConnectionReconnect,
  CanvasConnectionReconnection,
  CanvasConnectionStyleDefaults,
  CanvasConnectionsLayer,
  CanvasNode,
  CanvasNodeConnection,
  CanvasNodeFrame,
  CanvasPoint,
  CanvasProvider,
  CanvasSelection,
  CanvasToolbar,
  getConnectionAtPoint,
  useCanvas,
  useFitOnNodesReady,
} from '@minddrop/ui-canvas';
import { QueryBuilderSelectionToolbar } from '../QueryBuilderSelectionToolbar';
import { QueryBuilderToolbar } from '../QueryBuilderToolbar';
import { QueryFilterNodeCard } from '../QueryFilterNodeCard';
import { QueryLimitNodeCard } from '../QueryLimitNodeCard';
import { QueryNodeTypePicker } from '../QueryNodeTypePicker';
import { QueryResultsNodeCard } from '../QueryResultsNodeCard';
import { QuerySortNodeCard } from '../QuerySortNodeCard';
import { QuerySourceNodeCard } from '../QuerySourceNodeCard';
import {
  QUERY_NODE_PORT_Y,
  QUERY_NODE_WIDTHS,
  QueryNodeCardDataKey,
  QuerySourceCardDataKey,
} from '../constants';
import {
  connectQueryNodeToNearest,
  getQueryMismatchedConnectionIds,
} from '../utils';
import './QueryBuilderCanvas.css';

// The maximum distance from an edge at which a dragged toolbar
// card targets it for splicing, in canvas units
const SPLICE_HIT_THRESHOLD = 12;

// The shared look of query edges: plain flow lines without
// arrowheads
const CONNECTION_DEFAULTS: CanvasConnectionStyleDefaults = {
  arrows: 'none',
  color: 'blue',
};

// In-progress connection drags render as dashed previews
const PREVIEW_STYLE: CanvasConnectionStyleDefaults = {
  style: 'dashed',
};

interface NodeTypePickerState {
  /**
   * The endpoint the released connection drag started from,
   * connected into the picked node.
   */
  from: CanvasConnectionEnd;

  /**
   * The release point in canvas coordinates, where the picker
   * is shown and the picked node is created.
   */
  point: CanvasPoint;
}

export interface QueryBuilderCanvasProps {
  /**
   * The ID of the query being built.
   */
  queryId: string;
}

/**
 * Renders a query's node graph as an infinite pannable/zoomable
 * canvas onto which source, filter, sort and limit nodes are
 * dragged from a floating toolbar and connected into a flow
 * ending at the query's permanent results node.
 */
export const QueryBuilderCanvas: React.FC<QueryBuilderCanvasProps> = ({
  queryId,
}) => (
  <div className="query-builder-canvas floating-toolbar-host">
    <CanvasProvider>
      <QueryBuilderCanvasContent queryId={queryId} />
    </CanvasProvider>
  </div>
);

/**
 * Renders the builder's canvas, nodes, connections and
 * toolbars. Separated from the root component so it can use the
 * canvas context provided there.
 */
const QueryBuilderCanvasContent: React.FC<QueryBuilderCanvasProps> = ({
  queryId,
}) => {
  // The node type picker opened by releasing a connection drag
  // on the empty canvas
  const [nodeTypePicker, setNodeTypePicker] =
    useState<NodeTypePickerState | null>(null);

  // The ID of the connection a dragged toolbar card would
  // splice its node into
  const [spliceTargetId, setSpliceTargetId] = useState<string | null>(null);

  const query = Queries.use(queryId);

  // Entry flow counts per node
  const counts = Queries.useNodeCounts(queryId);

  const canvas = useCanvas();

  // Subscribe to database changes so mismatch styling follows
  // schema edits
  Databases.useAll();

  // The query's connections mapped onto canvas connections,
  // anchored at the port height on the node edges. Mismatched
  // filter trails take the warning color.
  const connections = useMemo<CanvasConnection[]>(() => {
    if (!query) {
      return [];
    }

    // The connections making up mismatched filter trails
    const mismatchedIds = getQueryMismatchedConnectionIds(query);

    return query.connections.map((connection) => ({
      id: connection.id,
      from: {
        nodeId: connection.from,
        side: 'right' as const,
        offset: QUERY_NODE_PORT_Y,
      },
      to: {
        nodeId: connection.to,
        side: 'left' as const,
        offset: QUERY_NODE_PORT_Y,
      },
      // Match the mismatch warning's color family
      color: mismatchedIds.has(connection.id) ? ('yellow' as const) : undefined,
      thickness:
        connection.id === spliceTargetId ? ('thick' as const) : undefined,
    }));
  }, [query, spliceTargetId]);

  // Fit the graph into view when the builder opens
  useFitOnNodesReady(query ? query.nodes.map((node) => node.id) : []);

  // Dismiss the node type picker on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keys pressed while typing in inputs
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === 'Escape') {
        setNodeTypePicker(null);
        canvas.clearConnectionDrag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas]);

  // Remove whichever kind of thing the canvas has selected
  const handleSelectionDelete = useCallback(
    (selection: CanvasSelection) => {
      if (!query) {
        return;
      }

      // Remove the selected connections
      if (selection.type === 'connections') {
        Queries.update(queryId, {
          connections: selection.ids.reduce(
            (current, connectionId) =>
              removeQueryConnection(current, connectionId),
            query.connections,
          ),
        });
        canvas.clearSelection();

        return;
      }

      // Remove the selected nodes along with their connections.
      // The results node is permanent and returned unchanged.
      const graph = selection.ids.reduce(
        (current, nodeId) => ({
          ...current,
          ...removeQueryNode(current, nodeId),
        }),
        query,
      );

      if (graph.nodes !== query.nodes) {
        Queries.update(queryId, {
          nodes: graph.nodes,
          connections: graph.connections,
        });
      }

      canvas.clearSelection();
    },
    [query, queryId, canvas],
  );

  // Break all of a node's incoming and outgoing connections
  const handleBreakNodeConnections = useCallback(
    (nodeId: string) => {
      if (!query) {
        return;
      }

      const connections = removeQueryNodeConnections(query.connections, nodeId);

      // Persist only when the node had connections
      if (connections !== query.connections) {
        Queries.update(queryId, { connections });
      }
    },
    [query, queryId],
  );

  // Connect a node to its nearest neighbours on both sides
  const handleConnectNodeToNearest = useCallback(
    (nodeId: string) => {
      if (!query) {
        return;
      }

      const connections = connectQueryNodeToNearest(query, nodeId);

      // Persist only when new connections were created
      if (connections !== query.connections) {
        Queries.update(queryId, { connections });
      }
    },
    [query, queryId],
  );

  // Persist a connection dragged between two nodes
  const handleConnect = useCallback(
    (connection: CanvasNodeConnection) => {
      if (!query) {
        return;
      }

      const connections = addQueryConnection(
        query,
        connection.from.nodeId,
        connection.to.nodeId,
      );

      // Invalid connections leave the connections unchanged
      if (connections !== query.connections) {
        Queries.update(queryId, { connections });
      }
    },
    [query, queryId],
  );

  // Only snap connection drags to targets the graph accepts a
  // connection into, re-anchored onto their input port
  const handleResolveConnectTarget = useCallback(
    (from: CanvasConnectionEnd, target: CanvasConnectionDragTarget) => {
      if (!query) {
        return null;
      }

      // Reject targets the graph rejects a connection into
      if (
        addQueryConnection(query, from.nodeId, target.nodeId) ===
        query.connections
      ) {
        return null;
      }

      // Snap onto the target's input port
      return {
        nodeId: target.nodeId,
        side: 'left' as const,
        offset: QUERY_NODE_PORT_Y,
      };
    },
    [query],
  );

  // Only snap re-connect drags to targets the re-routed
  // connection is valid against, re-anchored onto their port
  const handleResolveReconnectTarget = useCallback(
    (
      reconnect: CanvasConnectionReconnect,
      target: CanvasConnectionDragTarget,
    ) => {
      if (!query) {
        return null;
      }

      const original = query.connections.find(
        (connection) => connection.id === reconnect.connectionId,
      );

      if (!original) {
        return null;
      }

      // The candidate endpoints with the dragged end re-routed
      const from = reconnect.end === 'from' ? target.nodeId : original.from;
      const to = reconnect.end === 'to' ? target.nodeId : original.to;

      // Validate against the graph without the original, which
      // the re-route replaces
      const removed = removeQueryConnection(query.connections, original.id);

      if (
        addQueryConnection({ ...query, connections: removed }, from, to) ===
        removed
      ) {
        return null;
      }

      // Snap onto the port matching the dragged end's direction
      return {
        nodeId: target.nodeId,
        side: reconnect.end === 'from' ? ('right' as const) : ('left' as const),
        offset: QUERY_NODE_PORT_Y,
      };
    },
    [query],
  );

  // Open the node type picker when a connection drag is
  // released on the empty canvas. The canvas holds the preview
  // edge until the picker resolves.
  const handleConnectRelease = useCallback(
    (point: CanvasPoint, from: CanvasConnectionEnd) => {
      setNodeTypePicker({ from, point });
    },
    [],
  );

  // Re-route a connection end dragged onto a new node
  const handleConnectionReconnect = useCallback(
    (reconnection: CanvasConnectionReconnection) => {
      if (!query) {
        return;
      }

      // Drops on empty canvas remove the connection
      if (!reconnection.target) {
        Queries.update(queryId, {
          connections: removeQueryConnection(
            query.connections,
            reconnection.connectionId,
          ),
        });

        return;
      }

      const original = query.connections.find(
        (connection) => connection.id === reconnection.connectionId,
      );

      if (!original) {
        return;
      }

      // The re-routed endpoints
      const from =
        reconnection.end === 'from'
          ? reconnection.target.nodeId
          : original.from;
      const to =
        reconnection.end === 'to' ? reconnection.target.nodeId : original.to;

      // Replace the connection, validating the new route
      const removed = removeQueryConnection(query.connections, original.id);
      const connections = addQueryConnection(
        { ...query, connections: removed },
        from,
        to,
      );

      // Invalid routes keep the original connection
      if (connections !== removed) {
        Queries.update(queryId, { connections });
      }
    },
    [query, queryId],
  );

  // Add a node of the given type centered on a canvas point
  const addNode = useCallback(
    (type: QueryNodeType, point: CanvasPoint) => {
      if (!query) {
        return;
      }

      const node = createQueryNode(type, {
        x: Math.round(point.x - QUERY_NODE_WIDTHS[type] / 2),
        y: Math.round(point.y),
      });

      Queries.update(queryId, { nodes: [...query.nodes, node] });
    },
    [query, queryId],
  );

  // Insert a node of the given type into an existing
  // connection, centered on the drop point
  const spliceNode = useCallback(
    (type: QueryNodeType, point: CanvasPoint, connectionId: string) => {
      if (!query) {
        return;
      }

      const connection = query.connections.find(
        (queryConnection) => queryConnection.id === connectionId,
      );

      if (!connection) {
        return;
      }

      const node = createQueryNode(type, {
        x: Math.round(point.x - QUERY_NODE_WIDTHS[type] / 2),
        y: Math.round(point.y),
      });

      const nodes = [...query.nodes, node];

      // Replace the connection with a pair routing the flow
      // through the new node
      let connections = removeQueryConnection(query.connections, connection.id);

      connections = addQueryConnection(
        { ...query, nodes, connections },
        connection.from,
        node.id,
      );
      connections = addQueryConnection(
        { ...query, nodes, connections },
        node.id,
        connection.to,
      );

      Queries.update(queryId, { nodes, connections });
    },
    [query, queryId],
  );

  // Allow dragging toolbar cards over the canvas, highlighting
  // the connection under a dragged node card
  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      // Node cards splice into the connection they are dropped
      // onto, so track the edge under the drag
      if (dragContainsType(event, [QueryNodeCardDataKey])) {
        event.preventDefault();

        const connection = getConnectionAtPoint(
          connections,
          canvas.getNodes(),
          canvas.clientToCanvas({ x: event.clientX, y: event.clientY }),
          SPLICE_HIT_THRESHOLD,
        );

        setSpliceTargetId(connection ? connection.id : null);

        return;
      }

      // Source cards never splice, since sources take no input
      if (dragContainsType(event, [QuerySourceCardDataKey])) {
        event.preventDefault();
      }
    },
    [connections, canvas],
  );

  // Clear the splice highlight when the drag leaves the canvas
  const handleDragLeave = useCallback((event: React.DragEvent) => {
    // Ignore leaves into elements within the canvas
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }

    setSpliceTargetId(null);
  }, []);

  // Handle dropping a toolbar card onto the canvas
  const handleDrop = useCallback(
    (event: React.DragEvent, canvasPoint: CanvasPoint) => {
      event.preventDefault();

      setSpliceTargetId(null);

      // Source cards create an unconfigured source node at the
      // drop position, showing its database search
      if (event.dataTransfer.getData(toMimeType(QuerySourceCardDataKey))) {
        addNode('source', canvasPoint);

        return;
      }

      // Node cards create their node at the drop position
      const typeData = event.dataTransfer.getData(
        toMimeType(QueryNodeCardDataKey),
      );

      if (!typeData) {
        return;
      }

      const type = JSON.parse(typeData) as QueryNodeType;

      // Splice the node into the highlighted connection
      if (spliceTargetId) {
        spliceNode(type, canvasPoint, spliceTargetId);

        return;
      }

      addNode(type, canvasPoint);
    },
    [addNode, spliceNode, spliceTargetId],
  );

  // Create the node picked from the node type picker at the
  // release point and connect the released drag into it
  const handlePickNodeType = useCallback(
    (type: QueryNodeType) => {
      if (!query || !nodeTypePicker) {
        return;
      }

      // Align the node's input port with the release point
      const node = createQueryNode(type, {
        x: Math.round(nodeTypePicker.point.x),
        y: Math.round(nodeTypePicker.point.y - QUERY_NODE_PORT_Y),
      });

      const nodes = [...query.nodes, node];

      // Connect the drag's origin node into the new node
      const connections = addQueryConnection(
        { ...query, nodes },
        nodeTypePicker.from.nodeId,
        node.id,
      );

      Queries.update(queryId, { nodes, connections });

      setNodeTypePicker(null);
      canvas.clearConnectionDrag();
    },
    [query, queryId, nodeTypePicker, canvas],
  );

  // Dismiss the node type picker without creating a node
  const handleCloseNodeTypePicker = useCallback(() => {
    setNodeTypePicker(null);
    canvas.clearConnectionDrag();
  }, [canvas]);

  // Persist a node's position when a drag ends
  const handleNodeFrameChange = useCallback(
    (nodeId: string, frame: CanvasNodeFrame) => {
      if (!query) {
        return;
      }

      Queries.update(queryId, {
        nodes: updateQueryNode(query.nodes, nodeId, {
          x: frame.x,
          y: frame.y,
        }),
      });
    },
    [query, queryId],
  );

  // Persist every node moved by a group drag in one update
  const handleNodesFrameChange = useCallback(
    (frames: Record<string, CanvasNodeFrame>) => {
      if (!query) {
        return;
      }

      const nodes = Object.entries(frames).reduce(
        (current, [nodeId, frame]) =>
          updateQueryNode(current, nodeId, {
            x: frame.x,
            y: frame.y,
          }),
        query.nodes,
      );

      Queries.update(queryId, { nodes });
    },
    [query, queryId],
  );

  // Persist a name change after a short pause in typing
  const handleNameChange = useCallback(
    (name: string) => {
      Queries.update(queryId, { name });
    },
    [queryId],
  );

  // Render the toolbar floating above the canvas selection
  function renderSelectionToolbar(selection: CanvasSelection) {
    if (!query) {
      return null;
    }

    return (
      <QueryBuilderSelectionToolbar
        query={query}
        selection={selection}
        onRemove={handleSelectionDelete}
        onBreakConnections={handleBreakNodeConnections}
        onConnectNearest={handleConnectNodeToNearest}
      />
    );
  }

  // Render the card matching a node's type
  function renderNodeCard(node: QueryNode) {
    if (!query) {
      return null;
    }

    const cardProps = {
      counts: counts[node.id],
      onConnect: handleConnect,
      onConnectRelease: handleConnectRelease,
      resolveConnectTarget: handleResolveConnectTarget,
    };

    if (node.type === 'source') {
      return (
        <QuerySourceNodeCard queryId={queryId} node={node} {...cardProps} />
      );
    }

    if (node.type === 'filter') {
      return <QueryFilterNodeCard query={query} node={node} {...cardProps} />;
    }

    if (node.type === 'sort') {
      return <QuerySortNodeCard query={query} node={node} {...cardProps} />;
    }

    if (node.type === 'limit') {
      return <QueryLimitNodeCard query={query} node={node} {...cardProps} />;
    }

    return (
      <QueryResultsNodeCard queryId={queryId} node={node} {...cardProps} />
    );
  }

  // Nothing to build without the query
  if (!query) {
    return null;
  }

  return (
    <>
      <Canvas
        shortcutScope="focus"
        name={query.name}
        namePlaceholder="queries.editor.namePlaceholder"
        onNameChange={handleNameChange}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onNodesFrameChange={handleNodesFrameChange}
        selectionToolbar={renderSelectionToolbar}
        onSelectionDelete={handleSelectionDelete}
      >
        {/* The graph's connections, under the nodes */}
        <CanvasConnectionsLayer
          connections={connections}
          connectionDefaults={CONNECTION_DEFAULTS}
          dropTargetConnectionId={spliceTargetId}
          previewStyle={PREVIEW_STYLE}
          onConnectionReconnect={handleConnectionReconnect}
          resolveReconnectTarget={handleResolveReconnectTarget}
        />

        {/* The graph's nodes */}
        {query.nodes.map((node) => (
          <CanvasNode
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            width={QUERY_NODE_WIDTHS[node.type]}
            resizeEdges="none"
            dragMode="handle"
            className="query-builder-node"
            onFrameChange={(frame) => handleNodeFrameChange(node.id, frame)}
          >
            {renderNodeCard(node)}
          </CanvasNode>
        ))}

        {/* Node type picker shown when a connection drag is
            released on the empty canvas */}
        {nodeTypePicker && (
          <QueryNodeTypePicker
            point={nodeTypePicker.point}
            onPick={handlePickNodeType}
            onClose={handleCloseNodeTypePicker}
          />
        )}
      </Canvas>

      {/* Node cards toolbar */}
      <QueryBuilderToolbar />

      {/* Zoom controls */}
      <CanvasToolbar />
    </>
  );
};

/**
 * Checks whether a keyboard event originated from a text
 * editing element.
 */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
}
