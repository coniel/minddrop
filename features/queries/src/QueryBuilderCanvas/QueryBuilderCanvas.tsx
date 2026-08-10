import { useCallback, useEffect, useState } from 'react';
import {
  Queries,
  QueryConnection,
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
  CanvasNode,
  CanvasNodeFrame,
  CanvasPoint,
  CanvasProvider,
  CanvasSelection,
  CanvasToolbar,
  useCanvas,
  useCanvasStore,
  useFitOnNodesReady,
} from '@minddrop/ui-canvas';
import { QueryBuilderToolbar } from '../QueryBuilderToolbar';
import {
  PendingQueryConnection,
  QueryConnectionsLayer,
} from '../QueryConnectionsLayer';
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
import { connectQueryNodeToNearest, getQueryConnectionAtPoint } from '../utils';
import './QueryBuilderCanvas.css';

interface NodeTypePickerState {
  /**
   * The ID of the node the released connection drag started
   * from, connected into the picked node.
   */
  from: string;

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
  <div className="query-builder-canvas">
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
  // The in-progress connection drag
  const [pendingConnection, setPendingConnection] =
    useState<PendingQueryConnection | null>(null);

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

  // The canvas's selected node IDs, driving the cards' action
  // bars
  const selectedNodeIds = useCanvasStore((state) =>
    state.selection?.type === 'nodes' ? state.selection.ids : null,
  );

  // Fit the graph into view when the builder opens
  useFitOnNodesReady(query ? query.nodes.map((node) => node.id) : []);

  // Whether a connection drag is in progress
  const connecting = pendingConnection !== null;

  // Follow the pointer with the pending connection's endpoint,
  // dropping the connection when released outside a node
  useEffect(() => {
    if (!connecting) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setPendingConnection(
        (current) =>
          current && {
            ...current,
            toPoint: canvas.clientToCanvas({
              x: event.clientX,
              y: event.clientY,
            }),
          },
      );
    };

    // Node mouse up handlers complete the connection before this
    // listener clears it
    const handleMouseUp = () => {
      setPendingConnection(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [connecting, canvas]);

  // Cancel a pending connection on Escape. The canvas clears its
  // own selection.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keys pressed while typing in inputs
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === 'Escape') {
        setPendingConnection(null);
        setNodeTypePicker(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  // Remove a node along with its connections. The results node
  // is permanent and removing it leaves the graph unchanged.
  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      if (!query) {
        return;
      }

      const { nodes, connections } = removeQueryNode(query, nodeId);

      // Persist only when the node was actually removed
      if (nodes !== query.nodes) {
        Queries.update(queryId, { nodes, connections });
      }

      // Drop the selection targeting the removed node
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

  // Remove a connection from the graph
  const handleRemoveConnection = useCallback(
    (connectionId: string) => {
      if (!query) {
        return;
      }

      Queries.update(queryId, {
        connections: removeQueryConnection(query.connections, connectionId),
      });

      // Drop the selection targeting the removed connection
      canvas.clearSelection();
    },
    [query, queryId, canvas],
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
    (type: QueryNodeType, point: CanvasPoint, connection: QueryConnection) => {
      if (!query) {
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

        if (!query) {
          return;
        }

        const connection = getQueryConnectionAtPoint(
          query,
          canvas.clientToCanvas({ x: event.clientX, y: event.clientY }),
        );

        setSpliceTargetId(connection ? connection.id : null);

        return;
      }

      // Source cards never splice, since sources take no input
      if (dragContainsType(event, [QuerySourceCardDataKey])) {
        event.preventDefault();
      }
    },
    [query, canvas],
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

      // The highlighted connection is the insertion target
      const target = query?.connections.find(
        (connection) => connection.id === spliceTargetId,
      );

      // Splice the node into the connection it was dropped onto
      if (target) {
        spliceNode(type, canvasPoint, target);

        return;
      }

      addNode(type, canvasPoint);
    },
    [addNode, spliceNode, query, spliceTargetId],
  );

  // Open the node type picker when a connection drag is
  // released on the empty canvas
  const handleBackgroundMouseUp = useCallback(
    (event: React.MouseEvent, canvasPoint: CanvasPoint) => {
      if (!pendingConnection) {
        return;
      }

      setNodeTypePicker({ from: pendingConnection.from, point: canvasPoint });
    },
    [pendingConnection],
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
        nodeTypePicker.from,
        node.id,
      );

      Queries.update(queryId, { nodes, connections });

      setNodeTypePicker(null);
    },
    [query, queryId, nodeTypePicker],
  );

  // Dismiss the node type picker without creating a node
  const handleCloseNodeTypePicker = useCallback(() => {
    setNodeTypePicker(null);
  }, []);

  // Start a connection drag from a node's output port
  const handleStartConnection = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      setPendingConnection({
        from: nodeId,
        toPoint: canvas.clientToCanvas({
          x: event.clientX,
          y: event.clientY,
        }),
      });
    },
    [canvas],
  );

  // Complete a connection drag released over a node, persisting
  // the connection when it is valid
  const handleCompleteConnection = useCallback(
    (nodeId: string) => {
      if (!pendingConnection || !query) {
        return;
      }

      const connections = addQueryConnection(
        query,
        pendingConnection.from,
        nodeId,
      );

      // Invalid connections leave the connections unchanged
      if (connections !== query.connections) {
        Queries.update(queryId, { connections });
      }

      setPendingConnection(null);
    },
    [pendingConnection, query, queryId],
  );

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

  // Persist a name change after a short pause in typing
  const handleNameChange = useCallback(
    (name: string) => {
      Queries.update(queryId, { name });
    },
    [queryId],
  );

  // Render the card matching a node's type
  function renderNodeCard(node: QueryNode) {
    if (!query) {
      return null;
    }

    const cardProps = {
      counts: counts[node.id],
      // The action bar shows on the single selected node
      selected:
        selectedNodeIds?.length === 1 && selectedNodeIds[0] === node.id,
      onStartConnection: handleStartConnection,
      onCompleteConnection: handleCompleteConnection,
      onRemove: handleRemoveNode,
      onBreakConnections: handleBreakNodeConnections,
      onConnectNearest: handleConnectNodeToNearest,
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

  // The rendered pending edge: the live drag, or the released
  // drag frozen at the picker's position while it is open
  const renderedPendingConnection =
    pendingConnection ||
    (nodeTypePicker
      ? { from: nodeTypePicker.from, toPoint: nodeTypePicker.point }
      : null);

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
        onBackgroundMouseUp={handleBackgroundMouseUp}
        onSelectionDelete={handleSelectionDelete}
      >
        {/* The graph's connections, under the nodes */}
        <QueryConnectionsLayer
          query={query}
          pendingConnection={renderedPendingConnection}
          spliceTargetConnectionId={spliceTargetId}
          onRemoveConnection={handleRemoveConnection}
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
