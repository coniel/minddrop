import { Databases } from '@minddrop/databases';
import { Query, QueryConnection } from '@minddrop/queries';
import {
  CanvasNodeFrame,
  CanvasPoint,
  useCanvas,
  useCanvasStore,
} from '@minddrop/ui-canvas';
import { QUERY_NODE_PORT_Y, QUERY_NODE_WIDTHS } from '../constants';
import { getQueryMismatchedConnectionIds } from '../utils';
import './QueryConnectionsLayer.css';

export interface PendingQueryConnection {
  /**
   * The ID of the node the connection is being dragged from.
   */
  from: string;

  /**
   * The drag's current position in canvas coordinates.
   */
  toPoint: CanvasPoint;
}

export interface QueryConnectionsLayerProps {
  /**
   * The query whose connections are rendered.
   */
  query: Query;

  /**
   * The in-progress connection drag, rendered as a dashed edge
   * following the pointer.
   */
  pendingConnection: PendingQueryConnection | null;
}

/**
 * Renders the query graph's connections as an SVG layer of
 * bezier edges between node ports, following the nodes' live
 * frames during drags.
 */
export const QueryConnectionsLayer: React.FC<QueryConnectionsLayerProps> = ({
  query,
  pendingConnection,
}) => {
  // Canvas actions for applying edge clicks to the selection
  const store = useCanvas();

  // The nodes' live frames, updated as nodes are dragged
  const frames = useCanvasStore((state) => state.nodes);

  // The canvas's selected connections
  const selectedIds = useCanvasStore((state) =>
    state.selection?.type === 'connections' ? state.selection.ids : null,
  );

  // Subscribe to database changes so property mismatch styling
  // follows schema edits
  Databases.useAll();

  // The connections making up mismatched filter trails
  const mismatchedConnectionIds = getQueryMismatchedConnectionIds(query);

  // The output port position of a node, falling back to the
  // persisted node data before the node's frame registers
  function outputPortPoint(nodeId: string): CanvasPoint | null {
    const frame = nodeFrame(query, frames, nodeId);

    if (!frame) {
      return null;
    }

    return { x: frame.x + frame.width, y: frame.y + QUERY_NODE_PORT_Y };
  }

  // The input port position of a node
  function inputPortPoint(nodeId: string): CanvasPoint | null {
    const frame = nodeFrame(query, frames, nodeId);

    if (!frame) {
      return null;
    }

    return { x: frame.x, y: frame.y + QUERY_NODE_PORT_Y };
  }

  // Render a connection as a bezier edge with a wide invisible
  // hit area
  function renderConnection(connection: QueryConnection) {
    const from = outputPortPoint(connection.from);
    const to = inputPortPoint(connection.to);

    // Skip edges whose endpoints are missing
    if (!from || !to) {
      return null;
    }

    const path = edgePath(from, to);
    const selected = Boolean(selectedIds?.includes(connection.id));

    // Select the clicked edge, with a modifier toggling it into
    // the selection
    function handleHitAreaClick(event: React.MouseEvent) {
      if (event.shiftKey || event.metaKey || event.ctrlKey) {
        store.toggleConnectionSelection(connection.id);

        return;
      }

      store.selectConnections([connection.id]);
    }

    // Flag connections on a trail into a filter whose property
    // their databases do not contain
    const mismatched = mismatchedConnectionIds.has(connection.id);

    return (
      <g key={connection.id}>
        {/* Invisible wide stroke for easier clicking */}
        <path
          className="queries-connection-hit-area"
          d={path}
          onClick={handleHitAreaClick}
        />
        <path
          className={`queries-connection${
            selected ? ' queries-connection-selected' : ''
          }${mismatched ? ' queries-connection-mismatched' : ''}`}
          d={path}
        />
      </g>
    );
  }

  // The in-progress connection drag edge
  function renderPendingConnection() {
    if (!pendingConnection) {
      return null;
    }

    const from = outputPortPoint(pendingConnection.from);

    if (!from) {
      return null;
    }

    return (
      <path
        className="queries-connection queries-connection-pending"
        d={edgePath(from, pendingConnection.toPoint)}
      />
    );
  }

  return (
    <svg className="queries-connections-layer">
      {query.connections.map(renderConnection)}

      {/* The connection being dragged */}
      {renderPendingConnection()}
    </svg>
  );
};

/**
 * Returns a node's live frame from the canvas registry, falling
 * back to its persisted position and configured width.
 */
function nodeFrame(
  query: Query,
  frames: Record<string, CanvasNodeFrame>,
  nodeId: string,
): CanvasNodeFrame | null {
  const registered = frames[nodeId];

  if (registered) {
    return registered;
  }

  const node = query.nodes.find((queryNode) => queryNode.id === nodeId);

  if (!node) {
    return null;
  }

  return {
    x: node.x,
    y: node.y,
    width: QUERY_NODE_WIDTHS[node.type],
    height: 0,
  };
}

/**
 * Returns the SVG path of a bezier edge between two port
 * points, curving horizontally out of the ports.
 */
function edgePath(from: CanvasPoint, to: CanvasPoint): string {
  // Curve strength grows with the horizontal distance
  const bend = Math.max(40, Math.min(160, Math.abs(to.x - from.x) / 2));

  return `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${
    to.x - bend
  } ${to.y}, ${to.x} ${to.y}`;
}
