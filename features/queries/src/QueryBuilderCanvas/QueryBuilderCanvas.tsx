import { useCallback, useEffect, useState } from 'react';
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
import { QueryResultsNodeCard } from '../QueryResultsNodeCard';
import { QuerySortNodeCard } from '../QuerySortNodeCard';
import { QuerySourceNodeCard } from '../QuerySourceNodeCard';
import {
  QUERY_NODE_WIDTHS,
  QueryNodeCardDataKey,
  QuerySourceCardDataKey,
} from '../constants';
import { connectQueryNodeToNearest } from '../utils';
import './QueryBuilderCanvas.css';

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

  // Allow dragging toolbar cards over the canvas
  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (
      dragContainsType(event, [QueryNodeCardDataKey, QuerySourceCardDataKey])
    ) {
      event.preventDefault();
    }
  }, []);

  // Handle dropping a toolbar card onto the canvas
  const handleDrop = useCallback(
    (event: React.DragEvent, canvasPoint: CanvasPoint) => {
      event.preventDefault();

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

      addNode(JSON.parse(typeData) as QueryNodeType, canvasPoint);
    },
    [addNode],
  );

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

  return (
    <>
      <Canvas
        shortcutScope="focus"
        name={query.name}
        namePlaceholder="queries.editor.namePlaceholder"
        onNameChange={handleNameChange}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onSelectionDelete={handleSelectionDelete}
      >
        {/* The graph's connections, under the nodes */}
        <QueryConnectionsLayer
          query={query}
          pendingConnection={pendingConnection}
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
