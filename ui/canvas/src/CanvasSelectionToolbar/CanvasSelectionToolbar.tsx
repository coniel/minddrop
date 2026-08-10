import { SELECTION_BOX_PADDING, SELECTION_TOOLBAR_GAP } from '../constants';
import { CanvasNodeFrame, CanvasSelection } from '../types';
import { useCanvasStore } from '../useCanvasStore';
import { useIsInteracting } from '../useInteractionLock';
import { canvasToScreen, getSelectionBounds } from '../utils';
import './CanvasSelectionToolbar.css';

export interface CanvasSelectionToolbarProps {
  /**
   * Returns the toolbar's contents for the current selection.
   */
  renderToolbar: (selection: CanvasSelection) => React.ReactNode;
}

/**
 * Renders the consumer's toolbar floating above the current
 * selection. Rendered by the Canvas component outside the
 * transform layer, in viewport coordinates, so it keeps a
 * constant size while tracking pan and zoom.
 */
export const CanvasSelectionToolbar: React.FC<CanvasSelectionToolbarProps> = ({
  renderToolbar,
}) => {
  const selection = useCanvasStore((state) => state.selection);
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

  const bounds = getBounds(selection, nodes, connectionGeometry);

  // None of the selected items resolve to geometry
  if (!bounds) {
    return null;
  }

  // The toolbar clears the selection box's padding, so the gap
  // reads the same for a group as for a single node
  const padding =
    selection.type === 'nodes' && selection.ids.length > 1
      ? SELECTION_BOX_PADDING
      : 0;

  // The top center of the selection, in viewport coordinates
  const anchor = canvasToScreen(
    { x: bounds.x + bounds.width / 2, y: bounds.y - padding },
    pan,
    zoom,
  );

  return (
    <div
      className="ui-canvas-selection-toolbar"
      style={{ left: anchor.x, top: anchor.y - SELECTION_TOOLBAR_GAP }}
    >
      {renderToolbar(selection)}
    </div>
  );
};

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
