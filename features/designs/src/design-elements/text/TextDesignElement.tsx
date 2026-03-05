import { TextElement, createTextCssStyle } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';

export interface TextDesignElementProps {
  /**
   * The text element to render.
   */
  element: TextElement;
}

/**
 * Display renderer for a text design element.
 * Shows the mapped property value when available,
 * otherwise falls back to the element's placeholder text.
 */
export const TextDesignElement: React.FC<TextDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);

  // Use the mapped property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : element.placeholder;

  return (
    <span
      style={createTextCssStyle(element.style)}
      data-placeholder={element.placeholder}
    >
      {displayText}
    </span>
  );
};
