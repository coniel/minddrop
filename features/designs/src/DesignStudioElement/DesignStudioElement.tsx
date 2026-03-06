import React, { useCallback, useMemo } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { DesignStudioStore, useElement } from '../DesignStudioStore';
import { elementUIMap } from '../design-elements';
import { FlatDesignElement } from '../types';
import { useDesignElementDragDrop } from '../useDesignElementDragDrop';

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
}

export const DesignStudioElement: React.FC<DesignStudioElementProps> = ({
  elementId,
  index,
  isLastChild = false,
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
    />
  );
};

const DesignStudioElementInner: React.FC<{
  element: FlatDesignElement;
  index: number;
  isLastChild: boolean;
}> = ({ element, index, isLastChild }) => {
  const { t } = useTranslation();

  const { dragDropProps, isDragging } = useDesignElementDragDrop({
    index,
    element,
    isLastChild,
  });

  // Select the element to open its style editor
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      DesignStudioStore.getState().selectElement(element.id);
    },
    [element.id],
  );

  // Build the props that the component must spread
  // on its outermost DOM element
  const rootProps = useMemo(
    () => ({
      ...dragDropProps,
      onClick: handleClick,
      'data-element-id': element.id,
      style: isDragging ? { opacity: 0.5 } : undefined,
    }),
    [dragDropProps, handleClick, element.id, isDragging],
  );

  const ui = elementUIMap[element.type];

  if (!ui) {
    return null;
  }

  // Use the StudioComponent when one exists (for elements that
  // need interactive studio behaviour like image pickers or
  // FlexDropContainer). Otherwise fall back to DisplayComponent.
  if (ui.StudioComponent) {
    return <ui.StudioComponent element={element} rootProps={rootProps} />;
  }

  // Enrich the element with default placeholders for the studio
  const enrichedElement = enrichElementForStudio(element, t);

  return (
    <ui.DisplayComponent element={enrichedElement} rootProps={rootProps} />
  );
};

/**
 * Default placeholders keyed by element type. Uses i18n keys
 * for translatable text, hardcoded strings for non-translatable.
 */
const i18nPlaceholders: Record<string, string> = {
  text: 'design-studio.elements.text-placeholder',
  'formatted-text': 'design-studio.elements.text-placeholder',
};

const hardcodedPlaceholders: Record<string, string> = {
  url: 'https://www.example.com/page',
};

/**
 * Enriches a flat design element with studio-specific default
 * placeholder values when the element doesn't already have one.
 */
function enrichElementForStudio(
  element: FlatDesignElement,
  t: (key: string) => string,
): FlatDesignElement {
  // Only enrich elements that have a placeholder field
  if ('placeholder' in element && !element.placeholder) {
    const i18nKey = i18nPlaceholders[element.type];

    if (i18nKey) {
      return { ...element, placeholder: t(i18nKey) };
    }

    const hardcoded = hardcodedPlaceholders[element.type];

    if (hardcoded) {
      return { ...element, placeholder: hardcoded };
    }
  }

  return element;
}
