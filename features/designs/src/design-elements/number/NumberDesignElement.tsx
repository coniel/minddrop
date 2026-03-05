import { NumberElement, createTextCssStyle } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { formatNumber, formatNumberParts } from './formatNumber';

const DEFAULT_AFFIX_MARGIN = 2 / 16;

export interface NumberDesignElementProps {
  /**
   * The number element to render.
   */
  element: NumberElement;
}

/**
 * Display renderer for a number design element.
 * Shows the mapped property value when available,
 * otherwise falls back to the placeholder number.
 * Applies prefix/suffix formatting and style.
 */
export const NumberDesignElement: React.FC<NumberDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);

  // Use the mapped property value if available, otherwise the placeholder
  const rawValue =
    property?.value != null ? property.value : element.placeholder || '0';

  const numericValue = Number(rawValue);
  const baseStyle = createTextCssStyle(element.style);

  // Non-numeric value — render as plain text
  if (isNaN(numericValue)) {
    const text = String(rawValue);

    return (
      <span style={baseStyle} data-placeholder={text}>
        {text}
      </span>
    );
  }

  const parts = formatNumberParts(numericValue, element.format);
  const fullText = formatNumber(numericValue, element.format);

  // No prefix or suffix — render as a simple span
  if (!parts.prefix && !parts.suffix) {
    return (
      <span style={baseStyle} data-placeholder={fullText}>
        {fullText}
      </span>
    );
  }

  // Render with styled prefix and/or suffix spans
  const prefixStyle = createTextCssStyle({
    ...element.style,
    ...element.format?.prefixStyle,
    'margin-right':
      element.format?.prefixStyle?.['margin-right'] ?? DEFAULT_AFFIX_MARGIN,
  });

  const suffixStyle = createTextCssStyle({
    ...element.style,
    ...element.format?.suffixStyle,
    'margin-left':
      element.format?.suffixStyle?.['margin-left'] ?? DEFAULT_AFFIX_MARGIN,
  });

  return (
    <span style={baseStyle} data-placeholder={fullText}>
      {parts.prefix && <span style={prefixStyle}>{parts.prefix}</span>}
      {parts.number}
      {parts.suffix && <span style={suffixStyle}>{parts.suffix}</span>}
    </span>
  );
};
