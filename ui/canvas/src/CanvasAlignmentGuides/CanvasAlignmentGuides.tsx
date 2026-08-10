import { CanvasAlignmentGuide } from '../types';
import { useCanvasStore } from '../useCanvasStore';
import './CanvasAlignmentGuides.css';

/**
 * Renders the alignment guides between the node being dragged or
 * resized and the nodes it is snapped to. Rendered by the Canvas
 * component
 * inside the transform layer, in canvas coordinates.
 */
export const CanvasAlignmentGuides: React.FC = () => {
  const guides = useCanvasStore((state) => state.alignmentGuides);
  const zoom = useCanvasStore((state) => state.zoom);

  // No node is aligned with another
  if (!guides.length) {
    return null;
  }

  return (
    <svg
      className="ui-canvas-alignment-guides"
      width={1}
      height={1}
      overflow="visible"
    >
      {guides.map((guide) => {
        const line = getGuideLine(guide);

        return (
          <line
            key={`${guide.axis}-${guide.position}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            // The layer is scaled by the canvas transform, so the
            // stroke is unscaled to stay one screen pixel wide
            strokeWidth={1 / zoom}
          />
        );
      })}
    </svg>
  );
};

/**
 * Returns a guide's endpoints in canvas coordinates.
 */
function getGuideLine(guide: CanvasAlignmentGuide): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} {
  // Guides on the x axis run vertically
  if (guide.axis === 'x') {
    return {
      x1: guide.position,
      y1: guide.start,
      x2: guide.position,
      y2: guide.end,
    };
  }

  return {
    x1: guide.start,
    y1: guide.position,
    x2: guide.end,
    y2: guide.position,
  };
}
