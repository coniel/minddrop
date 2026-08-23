import { NumberPropertyElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { DesignText } from '../../DesignText';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';
import { formatNumber } from '../number/formatNumber';

export interface NumberPropertyRendererProps {
  /**
   * The number property element to render.
   */
  element: NumberPropertyElement;
}

/**
 * Display renderer for a number property element.
 * Shows the bound property value when available, otherwise falls
 * back to the placeholder number, formatted per the element's
 * format options.
 */
export const NumberPropertyRenderer: React.FC<NumberPropertyRendererProps> = ({
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
