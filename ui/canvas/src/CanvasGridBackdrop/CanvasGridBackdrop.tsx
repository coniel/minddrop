import { GRID_SIZE } from '../constants';
import { useCanvasStore } from '../useCanvasStore';
import './CanvasGridBackdrop.css';

/**
 * Renders the canvas background grid pattern. Rendered by the
 * Canvas component inside the transform layer, in canvas
 * coordinates, so panning and zooming move the grid as part of
 * the content's transform instead of re-rasterising the pattern
 * on every frame.
 */
export const CanvasGridBackdrop: React.FC = () => {
  const grid = useCanvasStore((state) => state.grid);
  const zoom = useCanvasStore((state) => state.zoom);

  // Fade the grid out between 40% and 30% zoom
  const opacity = Math.min(1, Math.max(0, (zoom - 0.3) / 0.1));

  // The canvas is drawn without a grid
  if (grid === 'none') {
    return null;
  }

  return (
    <div
      className={`ui-canvas-grid-backdrop ui-canvas-grid-backdrop-${grid}`}
      style={
        {
          // The tile size is fixed in canvas pixels, and the
          // backdrop's own extent is a multiple of it, so the
          // pattern lines up with the coordinates it marks.
          '--ui-canvas-grid-size': `${GRID_SIZE}px`,
          '--ui-canvas-grid-opacity': opacity,
        } as React.CSSProperties
      }
    />
  );
};
