import { TextElement, createTextCssStyle } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';

export interface TextDesignElementProps {
  /**
   * The text element to render.
   */
  element: TextElement;

  /**
   * Optional props to spread on the root DOM element.
   */
  rootProps?: Record<string, unknown>;
}

/**
 * Display renderer for a text design element.
 * Shows the mapped property value when available,
 * otherwise falls back to the element's placeholder text.
 */
export const TextDesignElement: React.FC<TextDesignElementProps> = ({
  element,
  rootProps,
}) => {
  const property = useElementProperty(element.id);

  // Use the mapped property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : element.placeholder;

  // Merge rootProps style with the element style
  const rootStyle = rootProps?.style as React.CSSProperties | undefined;

  return (
    <span
      {...rootProps}
      style={{ ...createTextCssStyle(element.style), ...rootStyle }}
      data-placeholder={element.placeholder}
    >
      {displayText}
    </span>
  );
};
