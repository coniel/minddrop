import { PropertyElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { DesignText } from '../../DesignText';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';

export interface TextPropertyRendererProps {
  /**
   * The property element to render.
   */
  element: PropertyElement;
}

/**
 * Display renderer for a property element rendered as a line of
 * text. Shows the bound property value when available, otherwise
 * falls back to the resolved placeholder text.
 */
export const TextPropertyRenderer: React.FC<TextPropertyRendererProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Use the bound property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? formatValue(property.value) : placeholder;

  return <DesignText text={displayText} css={useElementCssStyle(element)} />;
};

/**
 * Formats a property value as a line of text, running the values
 * of a multi-valued property together.
 */
function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return String(value);
}
