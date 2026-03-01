import { FormattedTextElement, createTextCssStyle } from '@minddrop/designs';
import { useElementProperty } from '../DesignPropertiesProvider';

export interface DesignFormattedTextElementProps {
  /**
   * The formatted text element to render.
   */
  element: FormattedTextElement;
}

/**
 * Display renderer for a formatted text design element.
 * Shows the mapped property value as text content when
 * available, otherwise renders an empty styled div.
 */
export const DesignFormattedTextElement: React.FC<
  DesignFormattedTextElementProps
> = ({ element }) => {
  const property = useElementProperty(element.id);

  // Display the mapped property value if available
  const displayText =
    property?.value != null ? String(property.value) : undefined;

  return <div style={createTextCssStyle(element.style)}>{displayText}</div>;
};
