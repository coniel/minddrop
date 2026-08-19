import { UrlElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { DesignText } from '../../DesignText';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';
import { formatUrl } from './formatUrl';

export interface UrlDesignElementProps {
  /**
   * The URL element to render.
   */
  element: UrlElement;
}

/**
 * Display renderer for a URL design element.
 * Shows the mapped property value when available, otherwise falls
 * back to the element's placeholder text, with URL parts shown or
 * hidden per the element's visibility flags.
 */
export const UrlDesignElement: React.FC<UrlDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Use the bound property value if available, otherwise the placeholder
  const rawText =
    property?.value != null ? String(property.value) : placeholder;

  // Format the URL based on visible parts
  const displayText = rawText
    ? formatUrl(rawText, {
        showProtocol: element.showProtocol,
        showSubdomain: element.showSubdomain,
        showDomain: element.showDomain,
        showTld: element.showTld,
        showPath: element.showPath,
      })
    : rawText;

  return <DesignText text={displayText} css={useElementCssStyle(element)} />;
};
