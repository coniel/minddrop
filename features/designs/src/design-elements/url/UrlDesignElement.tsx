import { UrlElement, createTextCssStyle } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { formatUrl } from './formatUrl';

export interface UrlDesignElementProps {
  /**
   * The URL element to render.
   */
  element: UrlElement;

  /**
   * Optional props to spread on the root DOM element.
   */
  rootProps?: Record<string, unknown>;
}

/**
 * Display renderer for a URL design element.
 * Shows the mapped property value when available,
 * otherwise falls back to the element's placeholder text.
 * Applies URL part formatting based on element visibility flags.
 */
export const UrlDesignElement: React.FC<UrlDesignElementProps> = ({
  element,
  rootProps,
}) => {
  const property = useElementProperty(element.id);

  // Use the mapped property value if available, otherwise the placeholder
  const rawText =
    property?.value != null ? String(property.value) : element.placeholder;

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
