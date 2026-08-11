import { ContentColor } from '@minddrop/ui-theme';
import { CanvasNodeFrame, CanvasPoint } from './CanvasNode.types';

/**
 * A side of a canvas node.
 */
export type CanvasNodeSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * An endpoint of a connection: a node and the side it attaches to.
 */
export interface CanvasConnectionEnd {
  /**
   * The ID of the node the connection attaches to.
   */
  nodeId: string;

  /**
   * The node side the connection attaches to, at its midpoint.
   */
  side: CanvasNodeSide;

  /**
   * The anchor's distance from the side's start corner (the top
   * corner for left/right sides, the left corner for top/bottom
   * sides), clamped to the side's length. Anchors at the side's
   * midpoint when omitted.
   */
  offset?: number;
}

/**
 * Which ends of a connection are drawn with an arrowhead.
 */
export type CanvasConnectionArrows = 'none' | 'end' | 'both';

/**
 * The path geometry a connection is drawn with: a bezier curve,
 * axis-aligned segments with sharp corners, or a direct line
 * between the endpoints.
 */
export type CanvasConnectionShape = 'curved' | 'straight' | 'direct';

/**
 * The stroke style a connection's curve is drawn with.
 */
export type CanvasConnectionStyle = 'solid' | 'dashed' | 'dotted';

/**
 * The stroke thickness a connection's curve is drawn with.
 */
export type CanvasConnectionThickness = 'thin' | 'medium' | 'thick';

/**
 * A visual connection between two nodes.
 */
export interface CanvasConnection {
  /**
   * The connection's unique ID within the canvas.
   */
  id: string;

  /**
   * The endpoint the connection was drawn from.
   */
  from: CanvasConnectionEnd;

  /**
   * The endpoint the connection was drawn to.
   */
  to: CanvasConnectionEnd;

  /**
   * Which ends are drawn with an arrowhead. Defaults to 'end'.
   */
  arrows?: CanvasConnectionArrows;

  /**
   * The path geometry the connection is drawn with. Defaults to
   * 'curved'.
   */
  shape?: CanvasConnectionShape;

  /**
   * The curve's stroke color. Defaults to 'default', the theme's
   * default border color.
   */
  color?: ContentColor;

  /**
   * The curve's stroke style. Defaults to 'solid'.
   */
  style?: CanvasConnectionStyle;

  /**
   * The curve's stroke thickness. Defaults to 'medium'.
   */
  thickness?: CanvasConnectionThickness;
}

/**
 * A resolved connection endpoint: the point a connection attaches
 * to and the node side it extends from.
 */
export interface CanvasConnectionAnchor {
  /**
   * The attachment point in canvas coordinates.
   */
  point: CanvasPoint;

  /**
   * The node side the connection extends from.
   */
  side: CanvasNodeSide;

  /**
   * The frame of the node the anchor attaches to, letting path
   * routing detour around the node. Omitted for anchors without
   * a node (e.g. a drag preview's cursor end), which are treated
   * as points.
   */
  frame?: CanvasNodeFrame;
}

/**
 * The re-routing of an existing connection: which connection a
 * drag re-connects, and which of its ends follows the cursor.
 */
export interface CanvasConnectionReconnect {
  /**
   * The ID of the connection being re-connected.
   */
  connectionId: string;

  /**
   * The connection end following the cursor.
   */
  end: 'from' | 'to';
}

/**
 * An in-progress drag-to-connect interaction.
 */
export interface CanvasConnectionDrag {
  /**
   * The ID of the node the drag is anchored to: the source node
   * of a new connection, or the fixed end of a re-connect drag.
   */
  fromNodeId: string;

  /**
   * The side of the anchored node the connection extends from.
   */
  fromSide: CanvasNodeSide;

  /**
   * The anchored end's offset along its side, mirroring
   * CanvasConnectionEnd's offset. Anchors at the side's midpoint
   * when omitted.
   */
  fromOffset?: number;

  /**
   * The current cursor position in canvas coordinates.
   */
  point: CanvasPoint;

  /**
   * The existing connection the drag re-routes, or null when the
   * drag draws a new connection.
   */
  reconnect: CanvasConnectionReconnect | null;

  /**
   * The ID of the node currently hovered as the connection
   * target, or null when no valid target is hovered.
   */
  targetNodeId: string | null;

  /**
   * The side of the target node nearest to the cursor, or null
   * when no valid target is hovered.
   */
  targetSide: CanvasNodeSide | null;

  /**
   * The hovered target end's offset along its side, mirroring
   * CanvasConnectionEnd's offset. Anchors at the side's midpoint
   * when omitted.
   */
  targetOffset?: number;
}

/**
 * The target values of a connection drag update.
 */
export interface CanvasConnectionDragTarget {
  /**
   * The ID of the hovered target node.
   */
  nodeId: string;

  /**
   * The side of the target node nearest to the cursor.
   */
  side: CanvasNodeSide;

  /**
   * The target end's offset along its side, mirroring
   * CanvasConnectionEnd's offset. Anchors at the side's midpoint
   * when omitted.
   */
  offset?: number;
}
