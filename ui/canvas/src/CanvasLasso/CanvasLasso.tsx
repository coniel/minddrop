import { useCanvasStore } from '../useCanvasStore';
import { getFrameFromPoints } from '../utils';
import './CanvasLasso.css';

/**
 * Renders the drag-to-select marquee. Rendered by the Canvas
 * component inside the transform layer, in canvas coordinates.
 */
export const CanvasLasso: React.FC = () => {
  const lasso = useCanvasStore((state) => state.lasso);
  const zoom = useCanvasStore((state) => state.zoom);

  // No lasso drag in progress
  if (!lasso) {
    return null;
  }

  // The marquee spans the drag's origin and current cursor point
  const frame = getFrameFromPoints(lasso.origin, lasso.point);

  return (
    <div
      className="ui-canvas-lasso"
      style={{
        transform: `translate(${frame.x}px, ${frame.y}px)`,
        width: frame.width,
        height: frame.height,
        // The layer is scaled by the canvas transform, so the
        // border is unscaled to stay one screen pixel wide
        borderWidth: 1 / zoom,
      }}
    />
  );
};
