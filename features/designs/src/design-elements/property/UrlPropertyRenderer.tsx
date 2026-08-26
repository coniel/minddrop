import { UrlPropertyElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { DesignText } from '../../DesignText';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';
import { formatUrl } from '../../utils';

export interface UrlPropertyRendererProps {
  /**
   * The URL property element to render.
   */
  element: UrlPropertyElement;
}

/**
 * Display renderer for a URL property element rendered as a link.
 * Shows the bound property value when available, otherwise falls
 * back to the element's placeholder text, with URL parts shown or
 * hidden per the element's format options.
 */
export const UrlPropertyRenderer: React.FC<UrlPropertyRendererProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Use the bound property value if available, otherwise the placeholder
  const rawText =
    property?.value != null ? String(property.value) : placeholder;

  // Format the URL based on visible parts
  const displayText = rawText ? formatUrl(rawText, element.format) : rawText;

  return <DesignText text={displayText} css={useElementCssStyle(element)} />;
};
