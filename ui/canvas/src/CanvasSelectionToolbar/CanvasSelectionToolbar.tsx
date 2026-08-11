import {
  SELECTION_BOX_PADDING,
  SELECTION_TOOLBAR_GAP,
  SELECTION_TOOLBAR_POINT_OFFSET,
} from '../constants';
import { CanvasNodeFrame, CanvasPoint, CanvasSelection } from '../types';
import { useCanvasStore } from '../useCanvasStore';
import { useIsInteracting } from '../useInteractionLock';
import { canvasToScreen, getSelectionBounds } from '../utils';
import './CanvasSelectionToolbar.css';

export interface CanvasSelectionToolbarProps {
  /**
   * Returns the toolbar's contents for the current selection.
   */
  renderToolbar: (selection: CanvasSelection) => React.ReactNode;

  /**
   * Whether the toolbar scales and fades in when it appears.
   * Defaults to true.
   */
  animated?: boolean;
}

/**
 * Renders the consumer's toolbar floating above the current
 * selection. Rendered by the Canvas component outside the
 * transform layer, in viewport coordinates, so it keeps a
 * constant size while tracking pan and zoom.
 */
export const CanvasSelectionToolbar: React.FC<CanvasSelectionToolbarProps> = ({
  renderToolbar,
  animated = true,
}) => {
  const selection = useCanvasStore((state) => state.selection);
  const selectionPoint = useCanvasStore((state) => state.selectionPoint);
  const nodes = useCanvasStore((state) => state.nodes);
  const zoom = useCanvasStore((state) => state.zoom);
  const pan = useCanvasStore((state) => state.pan);
  // Subscribed to so connection bounds recompute when the
  // connections layer mounts or its connections change
  const connectionGeometry = useCanvasStore(
    (state) => state.connectionGeometry,
  );
  const interacting = useIsInteracting();

  // Nothing is selected
  if (!selection) {
    return null;
  }

  // A drag is in progress, so the toolbar stays out of the way
  if (interacting) {
    return null;
  }

  const anchorPoint = getAnchorPoint(selection, selectionPoint, () =>
    getBounds(selection, nodes, connectionGeometry),
  );

  // None of the selected items resolve to a position
  if (!anchorPoint) {
    return null;
  }

  const anchor = canvasToScreen(anchorPoint.point, pan, zoom);

  // Point-anchored toolbars tuck in toward the cursor, which
  // otherwise leaves them looking detached from it
  const offset =
    anchorPoint.placement === 'point' ? SELECTION_TOOLBAR_POINT_OFFSET : 0;

  return (
    <div
      className={`ui-canvas-selection-toolbar ui-canvas-selection-toolbar-placement-${
        anchorPoint.placement
      }${animated ? ' ui-canvas-selection-toolbar-animated' : ''}`}
      // The toolbar re-mounts when the selection changes, so the
      // entry transition plays for each new selection rather than
      // sliding between them
      key={`${selection.type}:${selection.ids.join(',')}`}
      style={{
        left: anchor.x - offset,
        top: anchor.y - SELECTION_TOOLBAR_GAP + offset,
      }}
    >
      {renderToolbar(selection)}
    </div>
  );
};

/**
 * Where the toolbar sits relative to its anchor: its bottom left
 * corner on a point, or its bottom edge centered over bounds.
 */
type CanvasSelectionToolbarPlacement = 'point' | 'bounds';

interface CanvasSelectionToolbarAnchor {
  /**
   * The anchor in canvas coordinates.
   */
  point: CanvasPoint;

  /**
   * How the toolbar sits relative to the anchor.
   */
  placement: CanvasSelectionToolbarPlacement;
}

/**
 * Returns the anchor the toolbar is positioned against.
 * Connections are anchored where they were selected, since a
 * curve's bounds can put the toolbar far from the part of it
 * that was clicked. Nodes are anchored above their bounds,
 * matching the selection box drawn around them.
 */
function getAnchorPoint(
  selection: CanvasSelection,
  selectionPoint: CanvasPoint | null,
  getSelectionFrame: () => CanvasNodeFrame | null,
): CanvasSelectionToolbarAnchor | null {
  if (selection.type === 'connections' && selectionPoint) {
    return { point: selectionPoint, placement: 'point' };
  }

  const bounds = getSelectionFrame();

  if (!bounds) {
    return null;
  }

  // Clear the selection box's padding, so the gap reads the same
  // for a group as for a single node
  const padding =
    selection.type === 'nodes' && selection.ids.length > 1
      ? SELECTION_BOX_PADDING
      : 0;

  return {
    point: { x: bounds.x + bounds.width / 2, y: bounds.y - padding },
    placement: 'bounds',
  };
}

/**
 * Returns the frame the toolbar floats above: the selected
 * nodes' bounds, or the selected connections' bounds from the
 * connections layer.
 */
function getBounds(
  selection: CanvasSelection,
  nodes: Record<string, CanvasNodeFrame>,
  connectionGeometry: {
    getBounds: (ids: string[]) => CanvasNodeFrame | null;
  } | null,
): CanvasNodeFrame | null {
  if (selection.type === 'nodes') {
    return getSelectionBounds(selection.ids, nodes);
  }

  // Connection geometry lives in the connections layer, which is
  // not mounted on every canvas
  return connectionGeometry
    ? connectionGeometry.getBounds(selection.ids)
    : null;
}
