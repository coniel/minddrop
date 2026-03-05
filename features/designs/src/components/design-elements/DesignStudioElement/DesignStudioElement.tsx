import React, { ReactElement, useCallback } from 'react';
import { ContainerElementStyle } from '@minddrop/designs';
import { propsToClass } from '@minddrop/ui-primitives';
import {
  DesignStudioStore,
  useDesignStudioStore,
  useElement,
} from '../../../DesignStudioStore';
import {
  FlatContainerDesignElement,
  FlatDesignElement,
  FlatEditorElement,
  FlatFormattedTextElement,
} from '../../../types';
import { useDesignElementDragDrop } from '../../useDesignElementDragDrop';
import { DesignStudioContainerElement } from '../DesignStudioContainerElement';
import { DesignStudioDateElement } from '../DesignStudioDateElement';
import { DesignStudioEditorElement } from '../DesignStudioEditorElement';
import { DesignStudioFormattedTextElement } from '../DesignStudioFormattedTextElement';
import { DesignStudioIconElement } from '../DesignStudioIconElement';
import { DesignStudioImageElement } from '../DesignStudioImageElement';
import { DesignStudioImageViewerElement } from '../DesignStudioImageViewerElement';
import { DesignStudioNumberElement } from '../DesignStudioNumberElement';
import { DesignStudioTextElement } from '../DesignStudioTextElement';
import { DesignStudioUrlElement } from '../DesignStudioUrlElement';
import { DesignStudioWebviewElement } from '../DesignStudioWebviewElement';
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
}

export interface ElementComponentProps {
  element: FlatDesignElement;
  index: number;
}

/**
 * Element types that stretch to fill their parent's height.
 */
const fillHeightTypes: Set<string> = new Set([
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

function getElementComponent(element: FlatDesignElement): ReactElement | null {
  switch (element.type) {
    case 'container':
      return (
        <DesignStudioContainerElement
          element={element as FlatContainerDesignElement}
        />
      );
    case 'text':
      return <DesignStudioTextElement element={element} />;
    case 'formatted-text':
      return (
        <DesignStudioFormattedTextElement
          element={element as FlatFormattedTextElement}
        />
      );
    case 'number':
      return <DesignStudioNumberElement element={element} />;
    case 'date':
      return <DesignStudioDateElement element={element} />;
    case 'editor':
      return (
        <DesignStudioEditorElement element={element as FlatEditorElement} />
      );
    case 'url':
      return <DesignStudioUrlElement element={element} />;
    case 'icon':
      return <DesignStudioIconElement element={element} />;
    case 'image':
      return <DesignStudioImageElement element={element} />;
    case 'image-viewer':
      return <DesignStudioImageViewerElement element={element} />;
    case 'webview':
      return <DesignStudioWebviewElement element={element} />;
    default:
      return null;
  }
}

export const DesignStudioElement: React.FC<DesignStudioElementProps> = ({
  elementId,
  index,
  isLastChild = false,
  gap = 0,
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
    />
  );
};

const DesignStudioElementInner: React.FC<{
  element: FlatDesignElement;
  index: number;
  isLastChild: boolean;
  gap: number;
}> = ({ element, index, isLastChild, gap }) => {
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

  return (
    <div
      className="design-studio-element"
      data-element-id={element.id}
      style={
        stretch
          ? fillHeight
            ? {
                alignSelf: 'stretch',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }
            : { alignSelf: 'stretch' }
          : undefined
      }
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
            ? { flex: 1, display: 'flex', flexDirection: 'column' as const }
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
