import { DataView } from '@minddrop/data-views';
import { CanvasConnection } from '@minddrop/ui-canvas';

/**
 * A node on the canvas. Currently only entry nodes exist; the
 * union is designed to grow with further node types (e.g.
 * groups).
 */
export type CanvasViewNode = CanvasViewEntryNode;

/**
 * A database entry card placed on the canvas.
 */
export interface CanvasViewEntryNode {
  type: 'entry';

  /**
   * The node ID. Entry nodes use the entry's ID, making it an
   * item reference which must be mapped when serializing.
   */
  id: string;

  /**
   * The node's horizontal position in canvas coordinates.
   */
  x: number;

  /**
   * The node's vertical position in canvas coordinates.
   */
  y: number;

  /**
   * The node's width.
   */
  width: number;

  /**
   * The node's height. Omitted for auto-height nodes whose
   * height follows their content.
   */
  height?: number;
}

/**
 * A visual connection between two canvas nodes. Endpoint node IDs
 * are entry IDs when the node is an entry node, making them item
 * references which must be mapped when serializing.
 */
export type CanvasViewConnection = CanvasConnection;

export interface CanvasView extends DataView {
  type: 'canvas';
  options: Partial<CanvasViewOptions>;
  data: Partial<CanvasViewData>;
}

export interface CanvasViewToolbarCardOptions {
  /**
   * Whether the card is hidden from the toolbar.
   */
  hidden?: boolean;

  /**
   * The ID of the entry template used when creating entries via
   * the card. Blank entries are created when omitted.
   */
  templateId?: string;
}

export interface CanvasViewOptions {
  /**
   * The card layout used to render each database's entries,
   * keyed by database ID. Databases without an override use
   * their default card layout.
   */
  cardLayoutOverrides?: Record<string, string>;

  /**
   * The toolbar's database card configuration, keyed by database
   * ID. Databases without an entry use the default behaviour: a
   * visible card creating blank entries.
   */
  toolbarCards?: Record<string, CanvasViewToolbarCardOptions>;
}

export interface CanvasViewData {
  /**
   * The nodes placed on the canvas, in z-order (later nodes
   * render on top).
   */
  nodes: CanvasViewNode[];

  /**
   * The connections drawn between the canvas's nodes.
   */
  connections: CanvasViewConnection[];
}
