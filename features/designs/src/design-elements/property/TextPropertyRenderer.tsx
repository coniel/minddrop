import { TextPropertyElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { DesignText } from '../../DesignText';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';

export interface TextPropertyRendererProps {
  /**
   * The text property element to render.
   */
  element: TextPropertyElement;
}

/**
 * Display renderer for a text property element.
 * Shows the bound property value when available, otherwise falls
 * back to the resolved placeholder text.
 */
export const TextPropertyRenderer: React.FC<TextPropertyRendererProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Use the bound property value if available, otherwise the placeholder
  const displayText =
    property?.value != null ? String(property.value) : placeholder;

  return <DesignText text={displayText} css={useElementCssStyle(element)} />;
};
