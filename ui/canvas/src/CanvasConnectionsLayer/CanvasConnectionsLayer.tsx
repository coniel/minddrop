import { useEffect, useId, useRef } from 'react';
import { ContentColor } from '@minddrop/ui-theme';
import { useCanvasContext } from '../CanvasContext';
import {
  CONNECTION_ARROW_SIZES,
  CONNECTION_HALO_WIDTH,
  CONNECTION_THICKNESSES,
} from '../constants';
import {
  CanvasConnection,
  CanvasConnectionAnchor,
  CanvasConnectionThickness,
  CanvasNodeSide,
} from '../types';
import {
  CanvasConnectionReconnection,
  useCanvasConnectionReconnect,
} from '../useCanvasConnectionReconnect';
import { useCanvasStore } from '../useCanvasStore';
import {
  connectionIntersectsFrame,
  getConnectionColor,
  getConnectionDasharray,
  getConnectionHaloColor,
  getConnectionPath,
  getSideMidpoint,
} from '../utils';
import './CanvasConnectionsLayer.css';

export interface CanvasConnectionsLayerProps {
  /**
   * The connections to render. Connections whose endpoint nodes
   * are not mounted on the canvas are skipped.
   */
  connections: CanvasConnection[];

  /**
   * The ID of the selected connection, adding selection styling.
   */
  selectedId?: string | null;

  /**
   * Called when a connection's curve is pressed.
   */
  onConnectionMouseDown?: (
    connectionId: string,
    event: React.MouseEvent,
  ) => void;

  /**
   * Called when a connection end is dragged onto a new target
   * node. Enables re-connecting by dragging a connection's curve.
   */
  onConnectionReconnect?: (reconnection: CanvasConnectionReconnection) => void;
}

/**
 * Renders the curves of a canvas's connections in an SVG layer,
 * along with the preview curve of an in-progress connection drag.
 * Rendered as the first child of a Canvas so connections sit
 * below the nodes. Endpoints follow the live node registry, so
 * curves track nodes while they are dragged.
 */
export const CanvasConnectionsLayer: React.FC<CanvasConnectionsLayerProps> = ({
  connections,
  selectedId,
  onConnectionMouseDown,
  onConnectionReconnect,
}) => {
  const { store } = useCanvasContext();

  // The connections the registered hit test runs against, kept in
  // a ref so it never has to be re-registered
  const connectionsRef = useRef(connections);

  // Live node frames, keeping curves attached during node drags
  const nodes = useCanvasStore((state) => state.nodes);

  // The in-progress connection drag, driving the preview curve
  const connectionDrag = useCanvasStore((state) => state.connectionDrag);

  // Drag-to-re-connect behaviour for the connection hit areas
  const { getConnectionProps } = useCanvasConnectionReconnect({
    onReconnect: onConnectionReconnect,
  });

  useEffect(() => {
    connectionsRef.current = connections;
  }, [connections]);

  // Register the hit test the canvas uses to lasso select
  // connections. The layer owns the connections, so the canvas
  // has no way to test them itself.
  useEffect(() => {
    store.setConnectionHitTest((frame) =>
      connectionsRef.current
        .filter((connection) => {
          const fromFrame = store.getNode(connection.from.nodeId);
          const toFrame = store.getNode(connection.to.nodeId);

          // Skip connections to nodes not mounted on the canvas
          if (!fromFrame || !toFrame) {
            return false;
          }

          return connectionIntersectsFrame(
            {
              point: getSideMidpoint(fromFrame, connection.from.side),
              side: connection.from.side,
              frame: fromFrame,
            },
            {
              point: getSideMidpoint(toFrame, connection.to.side),
              side: connection.to.side,
              frame: toFrame,
            },
            connection.shape,
            frame,
          );
        })
        .map((connection) => connection.id),
    );

    return () => {
      store.setConnectionHitTest(null);
    };
  }, [store]);

  // Marker references are document-global, so the IDs are prefixed
  // to stay unique across mounted canvases
  const markerId = useId().replace(/:/g, '');

  // Arrowheads are colored per connection and sized in absolute
  // units per thickness, so a marker is defined for each
  // color/thickness combination in use. The default combination
  // is always defined for the preview curve.
  const markerVariants = new Map<
    string,
    { color: ContentColor; thickness: CanvasConnectionThickness }
  >();

  markerVariants.set('default-medium', {
    color: 'default',
    thickness: 'medium',
  });

  connections.forEach((connection) => {
    const color = connection.color ?? 'default';
    const thickness = connection.thickness ?? 'medium';

    markerVariants.set(`${color}-${thickness}`, { color, thickness });
  });

  // Render a connection's curve with its halo, hit area and
  // arrowheads
  function renderConnection(connection: CanvasConnection) {
    const fromFrame = nodes[connection.from.nodeId];
    const toFrame = nodes[connection.to.nodeId];

    // Skip connections to nodes not mounted on the canvas
    if (!fromFrame || !toFrame) {
      return null;
    }

    // Hide connections being re-connected; the preview curve
    // replaces them for the duration of the drag
    if (connectionDrag?.reconnect?.connectionId === connection.id) {
      return null;
    }

    // Anchor each end to its side's midpoint, with the frame for
    // shape routing around the node
    const from: CanvasConnectionAnchor = {
      point: getSideMidpoint(fromFrame, connection.from.side),
      side: connection.from.side,
      frame: fromFrame,
    };
    const to: CanvasConnectionAnchor = {
      point: getSideMidpoint(toFrame, connection.to.side),
      side: connection.to.side,
      frame: toFrame,
    };

    const arrows = connection.arrows ?? 'end';
    const selected = connection.id === selectedId;

    // The curve's configured stroke styling
    const color = connection.color ?? 'default';
    const thickness = connection.thickness ?? 'medium';
    const strokeWidth = CONNECTION_THICKNESSES[thickness];
    const dasharray = getConnectionDasharray(connection.style, strokeWidth);

    // Full path for the hit area and halo
    const path = getConnectionPath(from, to, connection.shape);

    // The visible stroke ends behind the arrowheads (which cover
    // the trimmed span) so it never pokes through their tips
    const trim = CONNECTION_ARROW_SIZES[thickness] - 1;
    const linePath = getConnectionPath(from, to, connection.shape, {
      trimStart: arrows === 'both' ? trim : 0,
      trimEnd: arrows !== 'none' ? trim : 0,
    });

    // The arrowhead marker matching the curve's color and
    // thickness
    const marker = `url(#${markerId}-arrow-${color}-${thickness})`;

    // Re-connect drag arming for this connection's hit area
    const reconnectProps = getConnectionProps(connection);

    // Report the press for selection and arm a re-connect drag
    function handleHitAreaMouseDown(event: React.MouseEvent) {
      if (onConnectionMouseDown) {
        onConnectionMouseDown(connection.id, event);
      }

      reconnectProps.onMouseDown(event);
    }

    return (
      <g
        key={connection.id}
        className={`ui-canvas-connection${
          selected ? ' ui-canvas-connection-selected' : ''
        }`}
      >
        {/* Invisible wide stroke for pressing the curve */}
        <path
          className="ui-canvas-connection-hit-area"
          d={path}
          onMouseDown={handleHitAreaMouseDown}
        />

        {/* Hover/selection halo under the curve, stroking the
            line's exact path so it stays centered on it */}
        <path
          className="ui-canvas-connection-halo"
          d={linePath}
          style={{
            stroke: getConnectionHaloColor(color),
            strokeWidth: strokeWidth + CONNECTION_HALO_WIDTH,
          }}
        />

        {/* Visible curve */}
        <path
          className="ui-canvas-connection-line"
          d={linePath}
          style={{
            stroke: getConnectionColor(color),
            strokeWidth,
            strokeDasharray: dasharray,
          }}
          markerEnd={arrows !== 'none' ? marker : undefined}
          markerStart={arrows === 'both' ? marker : undefined}
        />
      </g>
    );
  }

  // Render the preview curve of the in-progress connection drag
  function renderPreview() {
    if (!connectionDrag) {
      return null;
    }

    const sourceFrame = nodes[connectionDrag.fromNodeId];

    // The source node is not mounted
    if (!sourceFrame) {
      return null;
    }

    // The curve starts at the pressed side's midpoint
    const from: CanvasConnectionAnchor = {
      point: getSideMidpoint(sourceFrame, connectionDrag.fromSide),
      side: connectionDrag.fromSide,
      frame: sourceFrame,
    };

    // Snap to the target side's midpoint while a target is
    // hovered, otherwise follow the cursor
    const targetFrame = connectionDrag.targetNodeId
      ? nodes[connectionDrag.targetNodeId]
      : null;
    const to: CanvasConnectionAnchor =
      targetFrame && connectionDrag.targetSide
        ? {
            point: getSideMidpoint(targetFrame, connectionDrag.targetSide),
            side: connectionDrag.targetSide,
            frame: targetFrame,
          }
        : {
            point: connectionDrag.point,
            side: oppositeSide(connectionDrag.fromSide),
          };

    // During a re-connect drag the preview replaces the hidden
    // connection, so it takes over the connection's styling
    const reconnecting = connectionDrag.reconnect
      ? connections.find(
          (connection) =>
            connection.id === connectionDrag.reconnect?.connectionId,
        )
      : undefined;

    const color = reconnecting?.color ?? 'default';
    const thickness = reconnecting?.thickness ?? 'medium';
    const strokeWidth = CONNECTION_THICKNESSES[thickness];
    const arrows = reconnecting?.arrows ?? 'end';

    // The preview path runs from the anchored end to the cursor,
    // which reverses the connection's direction when its source
    // end is the one being dragged. Arrowheads are placed against
    // the connection's direction so they never flip mid-drag.
    const reversed = connectionDrag.reconnect?.end === 'from';
    const arrowAtStart = arrows === 'both' || (arrows === 'end' && reversed);
    const arrowAtEnd = arrows === 'both' || (arrows === 'end' && !reversed);

    const trim = CONNECTION_ARROW_SIZES[thickness] - 1;
    const marker = `url(#${markerId}-arrow-${color}-${thickness})`;

    return (
      <path
        className="ui-canvas-connection-line ui-canvas-connection-preview"
        d={getConnectionPath(from, to, reconnecting?.shape, {
          trimStart: arrowAtStart ? trim : 0,
          trimEnd: arrowAtEnd ? trim : 0,
        })}
        style={{
          stroke: getConnectionColor(color),
          strokeWidth,
          strokeDasharray: getConnectionDasharray(
            reconnecting?.style,
            strokeWidth,
          ),
        }}
        markerStart={arrowAtStart ? marker : undefined}
        markerEnd={arrowAtEnd ? marker : undefined}
      />
    );
  }

  return (
    <svg className="ui-canvas-connections" width={1} height={1}>
      {/* Arrowhead markers for each color/thickness in use */}
      <defs>
        {Array.from(markerVariants.values()).map(({ color, thickness }) => (
          <marker
            key={`${color}-${thickness}`}
            id={`${markerId}-arrow-${color}-${thickness}`}
            viewBox="0 0 10 10"
            refX="0"
            refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth={CONNECTION_ARROW_SIZES[thickness]}
            markerHeight={CONNECTION_ARROW_SIZES[thickness]}
            orient="auto-start-reverse"
          >
            <path
              className="ui-canvas-connection-arrow"
              d="M 0 0 L 10 5 L 0 10 z"
              style={{ fill: getConnectionColor(color) }}
            />
          </marker>
        ))}
      </defs>

      {connections.map(renderConnection)}

      {/* In-progress connection drag preview */}
      {renderPreview()}
    </svg>
  );
};

/**
 * Returns the side opposite to the given side.
 */
function oppositeSide(side: CanvasNodeSide): CanvasNodeSide {
  if (side === 'top') {
    return 'bottom';
  }

  if (side === 'bottom') {
    return 'top';
  }

  if (side === 'left') {
    return 'right';
  }

  return 'left';
}
