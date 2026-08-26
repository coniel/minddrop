import { FormattedTextPropertyElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';

export interface FormattedTextPropertyRendererProps {
  /**
   * The formatted text property element to render.
   */
  element: FormattedTextPropertyElement;
}

/**
 * Display renderer for a formatted text property element. Shows
 * the bound property value as static text when available,
 * otherwise falls back to the resolved placeholder text.
 */
export const FormattedTextPropertyRenderer: React.FC<
  FormattedTextPropertyRendererProps
> = ({ element }) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Use the bound property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : placeholder;

  return <div style={useElementCssStyle(element)}>{displayText}</div>;
};
