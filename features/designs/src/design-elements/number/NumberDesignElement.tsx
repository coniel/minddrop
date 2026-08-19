import { NumberElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { DesignText } from '../../DesignText';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';
import { formatNumber } from './formatNumber';

export interface NumberDesignElementProps {
  /**
   * The number element to render.
   */
  element: NumberElement;
}

/**
 * Display renderer for a number design element.
 * Shows the mapped property value when available, otherwise falls
 * back to the placeholder number, formatted per the element's
 * format options.
 */
export const NumberDesignElement: React.FC<NumberDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);
  const css = useElementCssStyle(element);

  // Use the bound property value if available, otherwise the placeholder
  const rawValue = property?.value != null ? property.value : placeholder;
  const numericValue = Number(rawValue);

  // No value at all: render an empty text element
  if (rawValue === '') {
    return <DesignText css={css} />;
  }

  // Non-numeric value: render as plain text
  if (isNaN(numericValue)) {
    return <DesignText text={String(rawValue)} css={css} />;
  }

  // Format the number with its prefix/suffix per the format options
  return (
    <DesignText text={formatNumber(numericValue, element.format)} css={css} />
  );
};
