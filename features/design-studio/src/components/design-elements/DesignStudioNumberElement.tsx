import {
  createTextCssStyle,
  formatNumber,
  formatNumberParts,
} from '@minddrop/designs';
import { FlatNumberElement } from '../../types';

const DEFAULT_AFFIX_MARGIN = 2 / 16;

export interface DesignStudioNumberElementProps {
  element: FlatNumberElement;
}

export const DesignStudioNumberElement: React.FC<
  DesignStudioNumberElementProps
> = ({ element }) => {
  const rawPlaceholder = element.placeholder || '0';
  const numericValue = Number(rawPlaceholder);
  const baseStyle = createTextCssStyle(element.style);

  if (isNaN(numericValue)) {
    return (
      <span style={baseStyle} data-placeholder={rawPlaceholder}>
        {rawPlaceholder}
      </span>
    );
  }

  const parts = formatNumberParts(numericValue, element.format);
  const fullText = formatNumber(numericValue, element.format);

  if (!parts.prefix && !parts.suffix) {
    return (
      <span style={baseStyle} data-placeholder={fullText}>
        {fullText}
      </span>
    );
  }

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
