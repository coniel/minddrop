import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ContainerElement,
  DesignElement as DesignElementType,
  RootElement,
} from '@minddrop/designs';
import { DropEventData } from '@minddrop/selection';
import {
  DesignElement,
  DesignPreviewProvider,
  DesignRootElement,
} from '../DesignElements';
import { useDesignPropertyMappingStore } from '../DesignPropertyMappingStore';
import { PropertyDropTarget } from '../PropertyDropTarget';
import { isPropertyCompatibleWithElement } from '../utils';
import './PropertyMappingOverlay.css';

export interface PropertyMappingOverlayProps {
  /**
   * The design tree used to determine which elements are
   * compatible drop targets.
   */
  tree: RootElement;

  /**
   * Callback fired when a property is dropped onto a compatible element.
   */
  onDrop: (elementId: string, drop: DropEventData) => void;
}

interface DropTargetRect {
  /** The design element this target represents */
  element: DesignElementType | RootElement;

  /** Whether this element already has a property mapped to it */
  mapped: boolean;

  /** Viewport-absolute position and size */
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Bounding rect of the dim overlay in viewport coordinates */
interface DimRect {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: string;
}

/**
 * Overlay layer for property-to-element drag feedback. Portals
 * into document.body to escape any CSS transforms, then uses
 * fixed positioning at exact viewport coordinates measured from
 * the actual design elements. Each drop target contains a
 * rendered copy of the element so it stays visible above the dim.
 */
export const PropertyMappingOverlay: React.FC<PropertyMappingOverlayProps> = ({
  tree,
  onDrop,
}) => {
  // Hidden ref mounted inside the design tree so we can
  // locate the canvas content container for DOM measurement
  const anchorRef = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<DropTargetRect[]>([]);
  const [dimRect, setDimRect] = useState<DimRect | null>(null);
  const [scale, setScale] = useState(1);

  // Get the currently dragged property type and property map from the store
  const draggingPropertyType = useDesignPropertyMappingStore(
    (state) => state.draggingPropertyType,
  );
  const propertyMap = useDesignPropertyMappingStore(
    (state) => state.propertyMap,
  );

  // Collect all compatible elements from the tree
  const compatibleElements = useMemo(() => {
    if (!draggingPropertyType) {
      return [];
    }

    const elements: (DesignElementType | RootElement)[] = [];

    // Recursively walk the tree to find compatible elements
    const walk = (node: DesignElementType | RootElement) => {
      if (isPropertyCompatibleWithElement(draggingPropertyType, node)) {
        elements.push(node);
      }

      // Recurse into children for container and root elements
      if ('children' in node && Array.isArray(node.children)) {
        for (const child of (node as ContainerElement | RootElement).children) {
          walk(child);
        }
      }
    };

    walk(tree);

    return elements;
  }, [tree, draggingPropertyType]);

  // Measure the actual DOM elements using viewport coordinates
  useLayoutEffect(() => {
    const anchor = anchorRef.current;

    if (!anchor || compatibleElements.length === 0) {
      setTargets([]);
      setDimRect(null);

      return;
    }

    // Find the design canvas content container
    const canvasContent = anchor.closest('.design-canvas-content');

    if (!canvasContent) {
      setTargets([]);
      setDimRect(null);

      return;
    }

    // Measure the canvas content for the dim overlay
    const canvasRect = canvasContent.getBoundingClientRect();
    const canvasStyle = window.getComputedStyle(canvasContent);

    // Detect the current zoom scale by comparing the rendered
    // size (getBoundingClientRect, includes transforms) against
    // the CSS layout size (offsetWidth, excludes transforms)
    const cssWidth = (canvasContent as HTMLElement).offsetWidth;
    const currentScale = cssWidth > 0 ? canvasRect.width / cssWidth : 1;

    setScale(currentScale);
    setDimRect({
      top: canvasRect.top,
      left: canvasRect.left,
      width: canvasRect.width,
      height: canvasRect.height,
      borderRadius: canvasStyle.borderRadius,
    });

    // Measure each compatible element using viewport coordinates
    const rects: DropTargetRect[] = [];

    for (const element of compatibleElements) {
      const wrapper = canvasContent.querySelector(
        `[data-element-id="${element.id}"]`,
      );

      if (!wrapper) {
        continue;
      }

      // The data-element-id wrapper uses display:contents so it has
      // no box of its own — measure its first child element instead
      const domElement = wrapper.firstElementChild || wrapper;
      const elementRect = domElement.getBoundingClientRect();

      rects.push({
        element,
        mapped: element.id in propertyMap,
        top: elementRect.top,
        left: elementRect.left,
        width: elementRect.width,
        height: elementRect.height,
      });
    }

    setTargets(rects);
  }, [compatibleElements, propertyMap]);

  return (
    <>
      {/* Hidden anchor inside the design tree for DOM measurement */}
      <div ref={anchorRef} style={{ display: 'none' }} />

      {/* Portal to document.body to escape CSS transforms */}
      {createPortal(
        <DesignPreviewProvider value>
          <div className="property-mapping-overlay">
            {/* Dark semi-transparent dim over the design canvas */}
            {dimRect && (
              <div
                className="property-mapping-dim"
                style={{
                  top: dimRect.top,
                  left: dimRect.left,
                  width: dimRect.width,
                  height: dimRect.height,
                  borderRadius: dimRect.borderRadius,
                }}
              />
            )}

            {/* Fixed-position drop targets at exact viewport coordinates */}
            {targets.map((target) => (
              <PropertyDropTarget
                key={target.element.id}
                element={target.element}
                onDrop={onDrop}
                mapped={target.mapped}
                style={{
                  position: 'fixed',
                  top: target.top,
                  left: target.left,
                  width: target.width,
                  height: target.height,
                  overflow: 'hidden',
                }}
              >
                {/* Rendered copy scaled to match the zoomed design */}
                <div
                  className="property-mapping-element-copy"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: target.width / scale,
                    height: target.height / scale,
                  }}
                >
                  {target.element.type === 'root' ? (
                    <DesignRootElement
                      element={target.element as RootElement}
                    />
                  ) : (
                    <DesignElement element={target.element} />
                  )}
                </div>
              </PropertyDropTarget>
            ))}
          </div>
        </DesignPreviewProvider>,
        document.body,
      )}
    </>
  );
};
