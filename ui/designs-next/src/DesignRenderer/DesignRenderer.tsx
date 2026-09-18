import { useEffect, useMemo, useRef, useState } from 'react';
import { Design, Designs } from '@minddrop/designs-next';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { DesignPropertiesProvider } from '../DesignPropertiesProvider';
import './DesignRenderer.css';
import { LayoutBoxRenderer } from './LayoutBoxRenderer';
import { LayoutElementRenderer } from './LayoutElementRenderer';

export interface DesignRendererProps {
  /**
   * The design to render.
   */
  design: Design;

  /**
   * The pixel width to render the design at. Worth passing when
   * rendering multiple aspect-locked designs at a shared, known
   * width so it is measured once. When omitted, the renderer fills
   * its container, tracking the container's width where the design
   * is aspect-locked.
   */
  width?: number;

  /**
   * The schemas of the properties the design's elements map to.
   * Needed alongside the values, which are read against their
   * schema.
   */
  properties?: PropertiesSchema;

  /**
   * The property values the design's mapped elements render, keyed
   * by property name.
   */
  values?: PropertyMap;
}

/**
 * Renders a design as flow: the design compiles to a tree of boxes
 * the browser lays out in one pass, content-fitted elements taking
 * the height their content needs. An aspect-locked design renders
 * its elements absolutely against its width instead.
 */
export const DesignRenderer: React.FC<DesignRendererProps> = ({
  design,
  width,
  properties,
  values,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

  // Compile the design once per design, aspect-locked designs
  // staying on the absolute path.
  const tree = useMemo(
    () => (design.aspectRatio ? null : Designs.resolveLayoutTree(design)),
    [design],
  );

  // Use the explicit width when given, the measured container width
  // otherwise.
  const renderWidth = width ?? measuredWidth;

  // The design's own elements, which it lays out. An element held
  // by another is placed and rendered by it.
  const blocks = Designs.resolveChildElements(design.elements);

  // Aspect-locked designs take their height from the render width
  const aspectRatio = design.aspectRatio
    ? Designs.resolveAspectRatioValue(design.aspectRatio)
    : null;
  const aspectHeight =
    aspectRatio && renderWidth !== null ? renderWidth / aspectRatio : null;

  // Measure the container's width for an aspect-locked design when
  // no explicit width is given.
  useEffect(() => {
    if (width !== undefined || !design.aspectRatio) {
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
  }, [width, design.aspectRatio]);

  return (
    <DesignPropertiesProvider properties={properties} values={values}>
      <div
        ref={containerRef}
        className="design-renderer"
        style={{ width, height: aspectHeight ?? undefined }}
      >
        {tree && <LayoutBoxRenderer box={tree} elements={design.elements} />}
        {/* Array order doubles as paint order, later elements layer on top */}
        {aspectHeight !== null &&
          blocks.map((element) => {
            // Resolve the element's pixel rect at the render width and
            // the card height.
            const rect = Designs.resolveElementRect(
              element,
              blocks,
              design.columns,
              renderWidth as number,
            );
            const verticalRect = Designs.resolveVerticalElementRect(
              element,
              blocks,
              design.rows,
              aspectHeight,
            );

            return (
              <LayoutElementRenderer
                key={element.id}
                element={element}
                elements={design.elements}
                style={{
                  position: 'absolute',
                  left: rect.left,
                  width: rect.width,
                  top: verticalRect.top,
                  height: verticalRect.height,
                }}
              />
            );
          })}
      </div>
    </DesignPropertiesProvider>
  );
};
