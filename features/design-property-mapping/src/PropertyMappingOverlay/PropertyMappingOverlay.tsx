import { useCallback, useMemo } from 'react';
import {
  DesignElement as DesignElementType,
  RootElement,
} from '@minddrop/designs';
import {
  DesignElementWrapperProvider,
  DesignRootElement,
} from '@minddrop/feature-designs';
import { DropEventData } from '@minddrop/selection';
import { useDesignPropertyMappingStore } from '../DesignPropertyMappingStore';
import { PropertyDropTarget } from '../PropertyDropTarget';
import { isPropertyCompatibleWithElement } from '../constants';
import './PropertyMappingOverlay.css';

export interface PropertyMappingOverlayProps {
  /**
   * The design tree to re-render as a floating drop-target layer.
   */
  tree: RootElement;

  /**
   * Callback fired when a property is dropped onto a compatible element.
   */
  onDrop: (elementId: string, drop: DropEventData) => void;
}

/**
 * Overlay layer for property-to-element drag feedback. Renders a
 * dark dim over the original design, then re-renders the same tree
 * on top with only compatible elements visible as drop targets.
 *
 * Uses `visibility: hidden` on the floating tree so all elements
 * still occupy layout space (preserving positioning), then sets
 * `visibility: visible` on compatible elements only. This avoids
 * the cascading-opacity problem with nested containers.
 */
export const PropertyMappingOverlay: React.FC<PropertyMappingOverlayProps> = ({
  tree,
  onDrop,
}) => {
  // Get the currently dragged property type and property map from the store
  const draggingPropertyType = useDesignPropertyMappingStore(
    (state) => state.draggingPropertyType,
  );
  const propertyMap = useDesignPropertyMappingStore(
    (state) => state.propertyMap,
  );

  // Wrapper function for each design element in the floating tree.
  // Compatible elements get a visible PropertyDropTarget wrapper,
  // incompatible elements get a hidden div wrapper.
  const elementWrapper = useCallback(
    (element: DesignElementType, children: React.ReactNode) => {
      // Check compatibility with the dragged property type
      const isCompatible =
        draggingPropertyType &&
        isPropertyCompatibleWithElement(draggingPropertyType, element);

      // Image and webview elements stretch to fill their parent
      // container, so the wrapper must also stretch to match
      const fillStyle =
        element.type === 'image'
          ? ({ alignSelf: 'stretch' } as const)
          : element.type === 'webview'
            ? ({ flex: 1, alignSelf: 'stretch' } as const)
            : undefined;

      if (isCompatible) {
        // Check if this element already has a property mapped to it
        const isMapped = element.id in propertyMap;

        return (
          <PropertyDropTarget
            element={element}
            onDrop={onDrop}
            mapped={isMapped}
            style={fillStyle}
          >
            {children}
          </PropertyDropTarget>
        );
      }

      // Incompatible elements remain hidden (inherit visibility: hidden
      // from the parent .property-mapping-targets container)
      return (
        <div className="property-mapping-hidden-element" style={fillStyle}>
          {children}
        </div>
      );
    },
    [draggingPropertyType, onDrop, propertyMap],
  );

  // Check if the root element is compatible with the dragged property
  const isRootCompatible = useMemo(
    () =>
      draggingPropertyType &&
      isPropertyCompatibleWithElement(draggingPropertyType, tree),
    [draggingPropertyType, tree],
  );

  // Whether the root element already has a property mapped to it
  const isRootMapped = tree.id in propertyMap;

  // The rendered design tree with element wrappers applied
  const renderedTree = (
    <DesignElementWrapperProvider
      wrapper={elementWrapper}
      excludeTypes={['root']}
    >
      <DesignRootElement element={tree} />
    </DesignElementWrapperProvider>
  );

  return (
    <div className="property-mapping-overlay">
      {/* Dark semi-transparent dim over the original design */}
      <div className="property-mapping-dim" />

      {/* Floating tree with only compatible elements visible */}
      <div className="property-mapping-targets">
        {isRootCompatible ? (
          <PropertyDropTarget
            element={tree}
            onDrop={onDrop}
            mapped={isRootMapped}
          >
            {renderedTree}
          </PropertyDropTarget>
        ) : (
          renderedTree
        )}
      </div>
    </div>
  );
};
