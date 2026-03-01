import { RefObject, useEffect, useState } from 'react';
import { DesignPropertyMap } from '@minddrop/databases';
import './PropertyConnectionLine.css';

export interface AllPropertyConnectionLinesProps {
  /**
   * Ref to the `.design-browser` container used to compute
   * container-relative coordinates.
   */
  containerRef: RefObject<HTMLDivElement | null>;

  /**
   * The current property map of element IDs to property names.
   */
  propertyMap: DesignPropertyMap;
}

interface LineCoords {
  /** Start point (right edge center of property item) */
  x1: number;
  y1: number;
  /** End point (left edge center of design element) */
  x2: number;
  y2: number;
}

/**
 * Renders SVG curved lines connecting all mapped properties
 * in the sidebar to their corresponding design elements.
 */
export const AllPropertyConnectionLines: React.FC<
  AllPropertyConnectionLinesProps
> = ({ containerRef, propertyMap }) => {
  const [lines, setLines] = useState<LineCoords[]>([]);

  // Compute line coordinates for all mapped property-element pairs
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      setLines([]);

      return;
    }

    const containerRect = container.getBoundingClientRect();
    const computed: LineCoords[] = [];

    for (const [elementId, propertyName] of Object.entries(propertyMap)) {
      // Query the DOM for source and target elements
      const propertyElement = container.querySelector(
        `[data-property-name="${propertyName}"]`,
      );
      const designElement = container.querySelector(
        `[data-element-id="${elementId}"]`,
      );

      if (!propertyElement || !designElement) {
        continue;
      }

      // The data-element-id wrapper uses display:contents so it has
      // no box of its own — measure its first child element instead
      const measuredDesignElement =
        designElement.firstElementChild || designElement;
      const propertyRect = propertyElement.getBoundingClientRect();
      const designRect = measuredDesignElement.getBoundingClientRect();

      // Start: right edge center of property item
      const x1 = propertyRect.right - containerRect.left;
      const y1 = propertyRect.top + propertyRect.height / 2 - containerRect.top;

      // End: left edge center of design element
      const x2 = designRect.left - containerRect.left;
      const y2 = designRect.top + designRect.height / 2 - containerRect.top;

      computed.push({ x1, y1, x2, y2 });
    }

    setLines(computed);
  }, [propertyMap, containerRef]);

  if (lines.length === 0) {
    return null;
  }

  return (
    <svg className="property-connection-line">
      {lines.map((coords, index) => {
        // Compute cubic bezier control points with horizontal offset
        const horizontalDistance = Math.abs(coords.x2 - coords.x1);
        const controlOffset = horizontalDistance * 0.4;

        const path = [
          `M ${coords.x1} ${coords.y1}`,
          `C ${coords.x1 + controlOffset} ${coords.y1},`,
          `${coords.x2 - controlOffset} ${coords.y2},`,
          `${coords.x2} ${coords.y2}`,
        ].join(' ');

        return (
          <path
            key={index}
            d={path}
            fill="none"
            stroke="var(--border-primary)"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        );
      })}
    </svg>
  );
};
