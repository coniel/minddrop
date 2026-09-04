import { useEffect, useRef, useState } from 'react';
import {
  Design,
  resolveAspectRatioValue,
  resolveElementRect,
  resolveRowLayout,
} from '@minddrop/designs-next';
import { getElementRenderer } from '../getElementRenderer';
import { resolveVerticalStyles } from '../utils';
import './DesignRenderer.css';

export interface DesignRendererProps {
  /**
   * The design to render.
   */
  design: Design;

  /**
   * The pixel width to render the design at. Worth passing when
   * rendering multiple designs at a shared, known width so it is
   * measured once. When omitted, the renderer fills its container
   * and tracks the container's width.
   */
  width?: number;
}

/**
 * Renders a design fluidly: each element's pixel rect is resolved
 * against the design's unit grid and rendered absolutely positioned,
 * with natural-height elements stretching the rows they span to fit
 * their content.
 */
export const DesignRenderer: React.FC<DesignRendererProps> = ({
  design,
  width,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measuredNodesRef = useRef(new Map<string, HTMLDivElement>());
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const [naturalHeights, setNaturalHeights] = useState<Record<string, number>>(
    {},
  );

  // Use the explicit width when given, the measured container width
  // otherwise.
  const renderWidth = width ?? measuredWidth;

  // Aspect-locked designs take their height from the render width
  const aspectRatio = design.aspectRatio
    ? resolveAspectRatioValue(design.aspectRatio)
    : null;
  const aspectHeight =
    aspectRatio && renderWidth !== null ? renderWidth / aspectRatio : null;

  // Row pixel offsets with rows stretched to fit natural element
  // heights, driving natural-height designs only.
  const rowLayout = design.aspectRatio
    ? null
    : resolveRowLayout(design.elements, design.rows, naturalHeights);

  // Measure the container's width when no explicit width is given
  useEffect(() => {
    if (width !== undefined) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      // Track the container's rendered width
      entries.forEach((entry) => {
        setMeasuredWidth((entry.target as HTMLElement).offsetWidth);
      });
    });

    // Observe the container
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [width]);

  // Track natural element heights so their rows can grow to fit
  // content. Re-runs when the width arrives, since elements only
  // render once it is known.
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setNaturalHeights((current) => {
        const next = { ...current };
        let changed = false;

        // Record each observed element's measured pixel height
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const elementId = target.dataset.elementId;

          if (elementId && next[elementId] !== target.offsetHeight) {
            next[elementId] = target.offsetHeight;
            changed = true;
          }
        });

        return changed ? next : current;
      });
    });

    // Observe every rendered natural-height element
    measuredNodesRef.current.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [design.elements, renderWidth]);

  // Registers a natural element's node for height measurement
  function setMeasuredNode(elementId: string, node: HTMLDivElement | null) {
    if (node) {
      measuredNodesRef.current.set(elementId, node);
    } else {
      measuredNodesRef.current.delete(elementId);
    }
  }

  return (
    <div
      ref={containerRef}
      className="design-renderer"
      style={{ width, height: aspectHeight ?? rowLayout?.totalHeight }}
    >
      {/* Array order doubles as paint order, later elements layer on top */}
      {renderWidth !== null &&
        design.elements.map((element) => {
          // Look up the element's renderer, skipping unregistered types
          const ElementComponent = getElementRenderer(element.type);

          if (!ElementComponent) {
            return null;
          }

          // Resolve the element's pixel rect at the render width
          const rect = resolveElementRect(
            element,
            design.elements,
            design.columns,
            renderWidth,
          );

          return (
            <div
              key={element.id}
              ref={
                element.naturalHeight && aspectHeight === null
                  ? (node) => setMeasuredNode(element.id, node)
                  : undefined
              }
              data-element-id={element.id}
              className="design-renderer-element"
              style={{
                left: rect.left,
                width: rect.width,
                ...resolveVerticalStyles(
                  element,
                  design,
                  aspectHeight,
                  rowLayout,
                ),
              }}
            >
              <ElementComponent element={element} />
            </div>
          );
        })}
    </div>
  );
};
