import { FormattedTextElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';

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
  const placeholder = useElementPlaceholder(element);

  // Use the bound property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : placeholder;

  return <div style={useElementCssStyle(element)}>{displayText}</div>;
};
