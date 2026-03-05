import { FormattedTextElement, createTextCssStyle } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';

export interface FormattedTextDesignElementProps {
  /**
   * The formatted text element to render.
   */
  element: FormattedTextElement;
}

/**
 * Display renderer for a formatted text design element.
 * Shows the mapped property value as static text.
 */
export const FormattedTextDesignElement: React.FC<
  FormattedTextDesignElementProps
> = ({ element }) => {
  const property = useElementProperty(element.id);

  // Use the mapped property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : element.placeholder;

  return <div style={createTextCssStyle(element.style)}>{displayText}</div>;
};
