import React, { useCallback } from 'react';
import { ContainerElementStyle } from '@minddrop/designs';
import { propsToClass } from '@minddrop/ui-primitives';
import {
  DesignStudioStore,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { elementUIMap } from '../design-elements';
import { FlatDesignElement } from '../types';
import { useDesignElementDragDrop } from '../useDesignElementDragDrop';
import './DesignStudioElement.css';

export interface DesignStudioElementProps {
  /**
   * The ID of the element to render.
   */
  elementId: string;

  /**
   * The index of the element within its parent.
   */
  index: number;

  /**
   * Whether the element is the last child of its parent.
   *
   * @default false
   */
  isLastChild?: boolean;

  /**
   * The gap between the elements within the same parent.
   *
   * @default 0
   */
  gap?: number;

  /**
   * The flex direction of the parent container.
   * Used to determine how stretch elements fill available space.
   *
   * @default 'column'
   */
  parentDirection?: React.CSSProperties['flexDirection'];
}

/**
 * Element types that stretch to fill their parent's height.
 */
const fillHeightTypes: Set<string> = new Set([
  'container',
  'image',
  'webview',
  'image-viewer',
  'editor',
]);

/**
 * Element types that always fill the full width of their parent.
 */
const fullWidthTypes: Set<string> = new Set([
  'image',
  'image-viewer',
  'webview',
  'editor',
]);

export const DesignStudioElement: React.FC<DesignStudioElementProps> = ({
  elementId,
  index,
  isLastChild = false,
  gap = 0,
  parentDirection = 'column',
}) => {
  const element = useElement(elementId);

  if (!element) {
    return null;
  }

  return (
    <DesignStudioElementInner
      element={element}
      index={index}
      isLastChild={isLastChild}
      gap={gap}
      parentDirection={parentDirection}
    />
  );
};

const DesignStudioElementInner: React.FC<{
  element: FlatDesignElement;
  index: number;
  isLastChild: boolean;
  gap: number;
  parentDirection: React.CSSProperties['flexDirection'];
}> = ({ element, index, isLastChild, gap, parentDirection }) => {
  const isSelected = useDesignStudioStore(
    (state) => state.highlightedElementId === element.id,
  );
  const isFading = useDesignStudioStore(
    (state) => state.fadingHighlightElementId === element.id,
  );

  const { dragDropProps, dropIndicator, isDragging } = useDesignElementDragDrop(
    {
      index,
      element,
      isLastChild,
      gap,
    },
  );

  // Select the element to open its style editor
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      DesignStudioStore.getState().selectElement(element.id);
    },
    [element.id],
  );

  const elementComponent = getElementComponent(element);

  if (!elementComponent) {
    return null;
  }

  const stretch = shouldElementStretch(element);
  const fillHeight = fillHeightTypes.has(element.type);
  const isRowParent = parentDirection === 'row';

  // For containers, explicit sizing (width/height) must live on the
  // wrapper so percentage values resolve against the correct parent
  const isContainer = element.type === 'container';
  const containerStyle = isContainer
    ? (element.style as ContainerElementStyle)
    : null;
  const containerSizing = containerStyle
    ? getContainerWrapperSizing(containerStyle)
    : {};
  const hasExplicitWidth = isContainer && containerStyle!.width > 0;
  const hasExplicitHeight = isContainer && containerStyle!.height > 0;

  // Build the wrapper style based on stretch, fill, and explicit sizing
  const wrapperStyle: React.CSSProperties = {
    ...containerSizing,
    ...(stretch
      ? {
          alignSelf: 'stretch',
          ...(fillHeight
            ? {
                // Grow to fill available space unless an explicit size
                // is set on that axis
                ...(!hasExplicitWidth && !hasExplicitHeight && { flexGrow: 1 }),
                display: 'flex',
                flexDirection: 'column' as const,
                // Allow shrinking below content size so children
                // (e.g. images) don't overflow the container
                minHeight: 0,
              }
            : {
                // In a row parent, stretch elements need flexGrow to fill
                // available width (alignSelf only stretches the cross axis)
                flexGrow: isRowParent && !hasExplicitWidth ? 1 : undefined,
                // Prevent content from forcing element wider than its
                // flex-allocated share
                minWidth: isRowParent ? 0 : undefined,
              }),
        }
      : {}),
  };

  return (
    <div
      className="design-studio-element"
      data-element-id={element.id}
      style={Object.keys(wrapperStyle).length > 0 ? wrapperStyle : undefined}
      {...dragDropProps}
    >
      <div
        className={propsToClass('design-studio-element-inner', {
          isDragging,
          isSelected,
          isFading,
        })}
        style={
          fillHeight
            ? {
                flex: 1,
                display: 'flex',
                flexDirection: 'column' as const,
                minHeight: 0,
              }
            : undefined
        }
        onClick={handleClick}
        onAnimationEnd={
          isFading
            ? () => DesignStudioStore.getState().clearFadingHighlight()
            : undefined
        }
      >
        {elementComponent}
      </div>
      {dropIndicator}
    </div>
  );
};

/**
 * Returns whether the element should stretch within its parent.
 * Images, viewers, and editors always stretch; containers stretch
 * based on their stretch style property.
 */
function shouldElementStretch(element: FlatDesignElement): boolean {
  if (fullWidthTypes.has(element.type)) {
    return true;
  }

  return (
    element.type === 'container' &&
    (element.style as ContainerElementStyle).stretch
  );
}

/**
 * Extracts explicit sizing properties from a container element's
 * style so they can be applied to the outermost wrapper div.
 * Percentage widths must live on the wrapper (the actual flex
 * item) rather than on an inner element, otherwise they resolve
 * against the wrong parent.
 */
function getContainerWrapperSizing(
  style: ContainerElementStyle,
): React.CSSProperties {
  const widthUnit = style.widthUnit || 'px';
  const maxWidthUnit = style.maxWidthUnit || 'px';

  return {
    width: style.width > 0 ? `${style.width}${widthUnit}` : undefined,
    height: style.height > 0 ? `${style.height}px` : undefined,
    maxWidth:
      style.maxWidth > 0 ? `${style.maxWidth}${maxWidthUnit}` : undefined,
    maxHeight: style.maxHeight > 0 ? `${style.maxHeight}px` : undefined,
  };
}

/**
 * Looks up the studio renderer for the given element type
 * from the UI registry and returns the rendered component.
 */
function getElementComponent(
  element: FlatDesignElement,
): React.ReactElement | null {
  const ui = elementUIMap[element.type];

  if (!ui) {
    return null;
  }

  const Component = ui.StudioComponent;

  return <Component element={element} />;
}
