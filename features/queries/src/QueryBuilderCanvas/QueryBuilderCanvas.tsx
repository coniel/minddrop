import { useCallback, useEffect, useState } from 'react';
import { DatabaseId } from '@minddrop/databases';
import {
  Queries,
  QueryNode,
  QueryNodeType,
  addQueryConnection,
  createQueryNode,
  removeQueryConnection,
  removeQueryNode,
  updateQueryNode,
} from '@minddrop/queries';
import { dragContainsType, toMimeType } from '@minddrop/selection';
import {
  Canvas,
  CanvasNode,
  CanvasNodeFrame,
  CanvasPoint,
  CanvasProvider,
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
import { QuerySourcePicker } from '../QuerySourcePicker';
import {
  QUERY_NODE_WIDTHS,
  QueryNodeCardDataKey,
  QuerySourceCardDataKey,
} from '../constants';
import './QueryBuilderCanvas.css';

// The width of the source database picker card
const SOURCE_PICKER_WIDTH = 260;

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
 * Renders the builder's canvas, nodes, connections, pickers and
 * toolbars. Separated from the root component so it can use the
 * canvas context provided there.
 */
const QueryBuilderCanvasContent: React.FC<QueryBuilderCanvasProps> = ({
  queryId,
}) => {
  // The in-progress connection drag
  const [pendingConnection, setPendingConnection] =
    useState<PendingQueryConnection | null>(null);

  // The selected connection, targeted by deletion. Node selection
  // is held by the canvas.
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    string | null
  >(null);

  // The active source database picker's anchor point in canvas
  // coordinates, spawned by dropping the source toolbar card
  const [sourcePicker, setSourcePicker] = useState<CanvasPoint | null>(null);

  const query = Queries.use(queryId);

  // Entry flow counts per node
  const counts = Queries.useNodeCounts(queryId);

  const canvas = useCanvas();

  // The canvas's selection, held for nodes
  const canvasSelection = useCanvasStore((state) => state.selection);

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

  // Drop the connection selection when nodes are selected, so
  // that only one of the two is ever selected
  useEffect(() => {
    if (canvasSelection?.type === 'nodes') {
      setSelectedConnectionId(null);
    }
  }, [canvasSelection]);

  // Delete the selected nodes or connection, and cancel the
  // selection and pending connection on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keys pressed while typing in inputs
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === 'Escape') {
        setSelectedConnectionId(null);
        setPendingConnection(null);
        canvas.clearSelection();

        return;
      }

      if (event.key !== 'Delete' && event.key !== 'Backspace') {
        return;
      }

      if (!query) {
        return;
      }

      // Remove the selected connection
      if (selectedConnectionId) {
        Queries.update(queryId, {
          connections: removeQueryConnection(
            query.connections,
            selectedConnectionId,
          ),
        });
        setSelectedConnectionId(null);

        return;
      }

      const selectedNodeIds = canvas.getSelectedNodeIds();

      if (!selectedNodeIds.length) {
        return;
      }

      // Remove the selected nodes along with their connections.
      // The results node is permanent and returned unchanged.
      const graph = selectedNodeIds.reduce(
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
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedConnectionId, query, queryId, canvas]);

  // Add a node of the given type centered on a canvas point
  const addNode = useCallback(
    (type: QueryNodeType, point: CanvasPoint, database?: string) => {
      if (!query) {
        return;
      }

      const node = createQueryNode(
        type,
        {
          x: Math.round(point.x - QUERY_NODE_WIDTHS[type] / 2),
          y: Math.round(point.y),
        },
        { database },
      );

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

      // Source cards spawn the database picker at the drop
      // position
      if (event.dataTransfer.getData(toMimeType(QuerySourceCardDataKey))) {
        setSourcePicker({
          x: Math.round(canvasPoint.x),
          y: Math.round(canvasPoint.y),
        });

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

  // Clear the connection selection when the empty canvas is
  // pressed. The canvas clears the node selection itself.
  const handleBackgroundMouseDown = useCallback(() => {
    setSelectedConnectionId(null);
  }, []);

  // Start a connection drag from a node's output port
  const handleStartConnection = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      setSelectedConnectionId(null);
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

  // Create a source node for the picked database at the picker
  // position
  const handleSourcePickerSelect = useCallback(
    (databaseId: DatabaseId) => {
      if (!sourcePicker) {
        return;
      }

      setSourcePicker(null);
      addNode('source', sourcePicker, databaseId);
    },
    [sourcePicker, addNode],
  );

  // Dismiss the source picker without a selection
  const handleSourcePickerDismiss = useCallback(() => {
    setSourcePicker(null);
  }, []);

  // Render the card matching a node's type
  function renderNodeCard(node: QueryNode) {
    if (!query) {
      return null;
    }

    const cardProps = {
      counts: counts[node.id],
      onStartConnection: handleStartConnection,
      onCompleteConnection: handleCompleteConnection,
    };

    if (node.type === 'source') {
      return <QuerySourceNodeCard node={node} {...cardProps} />;
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

  // Render the active source picker at its canvas position
  function renderSourcePicker() {
    if (!sourcePicker) {
      return null;
    }

    return (
      <div
        className="query-builder-picker"
        style={{
          transform: `translate(${
            sourcePicker.x - SOURCE_PICKER_WIDTH / 2
          }px, ${sourcePicker.y}px)`,
          width: SOURCE_PICKER_WIDTH,
        }}
      >
        <QuerySourcePicker
          onSelect={handleSourcePickerSelect}
          onDismiss={handleSourcePickerDismiss}
        />
      </div>
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
        onBackgroundMouseDown={handleBackgroundMouseDown}
      >
        {/* The graph's connections, under the nodes */}
        <QueryConnectionsLayer
          query={query}
          pendingConnection={pendingConnection}
          selectedConnectionId={selectedConnectionId}
          onSelectConnection={setSelectedConnectionId}
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

        {/* Active source database picker */}
        {renderSourcePicker()}
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
