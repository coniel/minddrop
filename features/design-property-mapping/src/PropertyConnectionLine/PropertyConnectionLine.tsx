import { RefObject, useEffect, useRef, useState } from 'react';
import { useDesignPropertyMappingStore } from '../DesignPropertyMappingStore';
import './PropertyConnectionLine.css';

export interface PropertyConnectionLineProps {
  /**
   * Ref to the `.design-browser` container used to compute
   * container-relative coordinates.
   */
  containerRef: RefObject<HTMLDivElement | null>;
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
 * Renders an SVG curved line connecting a hovered mapped property
 * in the sidebar to its corresponding design element in the canvas.
 * Also toggles a highlight class on the target element.
 */
export const PropertyConnectionLine: React.FC<PropertyConnectionLineProps> = ({
  containerRef,
}) => {
  const hoveredPropertyName = useDesignPropertyMappingStore(
    (state) => state.hoveredPropertyName,
  );
  const propertyMap = useDesignPropertyMappingStore(
    (state) => state.propertyMap,
  );

  const setHoveredPropertyName = useDesignPropertyMappingStore(
    (state) => state.setHoveredPropertyName,
  );

  const [coords, setCoords] = useState<LineCoords | null>(null);

  // Track the currently highlighted element so we can clean up
  const highlightedElementRef = useRef<Element | null>(null);

  // Attach mouseenter/mouseleave listeners to mapped design elements
  // so hovering a design element also triggers the connection line.
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handlers: {
      element: Element;
      enter: () => void;
      leave: () => void;
    }[] = [];

    // For each mapped element, attach hover listeners
    for (const [elementId, propertyName] of Object.entries(propertyMap)) {
      const wrapper = container.querySelector(
        `[data-element-id="${elementId}"]`,
      );

      if (!wrapper) {
        continue;
      }

      // Use the first child since wrapper is display:contents
      const target = wrapper.firstElementChild || wrapper;

      const enter = () => setHoveredPropertyName(propertyName);
      const leave = () => setHoveredPropertyName(null);

      target.addEventListener('mouseenter', enter);
      target.addEventListener('mouseleave', leave);
      handlers.push({ element: target, enter, leave });
    }

    return () => {
      for (const { element, enter, leave } of handlers) {
        element.removeEventListener('mouseenter', enter);
        element.removeEventListener('mouseleave', leave);
      }
    };
  }, [propertyMap, containerRef, setHoveredPropertyName]);

  // Compute line coordinates and highlight when a property is hovered
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !hoveredPropertyName) {
      // Clean up any existing highlight
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove(
          'property-mapping-highlighted',
        );
        highlightedElementRef.current = null;
      }

      setCoords(null);

      return;
    }

    // Reverse-lookup: find the elementId whose mapped property matches
    const elementId = Object.keys(propertyMap).find(
      (key) => propertyMap[key] === hoveredPropertyName,
    );

    if (!elementId) {
      setCoords(null);

      return;
    }

    // Query the DOM for source and target elements
    const propertyElement = container.querySelector(
      `[data-property-name="${hoveredPropertyName}"]`,
    );
    const designElement = container.querySelector(
      `[data-element-id="${elementId}"]`,
    );

    if (!propertyElement || !designElement) {
      setCoords(null);

      return;
    }

    // Get container-relative coordinates.
    // The data-element-id wrapper uses display:contents so it has no
    // box of its own — measure its first child element instead.
    const measuredDesignElement =
      designElement.firstElementChild || designElement;
    const containerRect = container.getBoundingClientRect();
    const propertyRect = propertyElement.getBoundingClientRect();
    const designRect = measuredDesignElement.getBoundingClientRect();

    // Start: right edge center of property item
    const x1 = propertyRect.right - containerRect.left;
    const y1 = propertyRect.top + propertyRect.height / 2 - containerRect.top;

    // End: left edge center of design element
    const x2 = designRect.left - containerRect.left;
    const y2 = designRect.top + designRect.height / 2 - containerRect.top;

    setCoords({ x1, y1, x2, y2 });

    // Highlight the target design element.
    // Query the first child with actual dimensions since
    // the data-element-id wrapper uses display:contents.
    const highlightTarget = designElement.firstElementChild || designElement;

    highlightTarget.classList.add('property-mapping-highlighted');
    highlightedElementRef.current = highlightTarget;

    // Clean up highlight on unmount or when hover changes
    return () => {
      highlightTarget.classList.remove('property-mapping-highlighted');
      highlightedElementRef.current = null;
    };
  }, [hoveredPropertyName, propertyMap, containerRef]);

  if (!coords) {
    return null;
  }

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
    <svg className="property-connection-line">
      <path
        d={path}
        fill="none"
        stroke="var(--border-primary)"
        strokeWidth="3"
        strokeDasharray="6 4"
      />
    </svg>
  );
};
