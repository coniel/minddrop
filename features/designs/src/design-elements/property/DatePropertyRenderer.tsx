import { DatePropertyElement } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { DesignText } from '../../DesignText';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholder } from '../../useElementPlaceholder';
import { formatDesignDate } from '../date/formatDesignDate';

export interface DatePropertyRendererProps {
  /**
   * The date property element to render.
   */
  element: DatePropertyElement;
}

/**
 * Display renderer for a date property element.
 * Shows the bound property value when available, otherwise falls
 * back to the placeholder date, formatted per the element's format
 * options.
 */
export const DatePropertyRenderer: React.FC<DatePropertyRendererProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);
  const css = useElementCssStyle(element);

  // Use the bound property value if available, otherwise the placeholder
  const rawValue = property?.value != null ? property.value : placeholder;

  // No value at all: render an empty text element
  if (!rawValue) {
    return <DesignText css={css} />;
  }

  // Parse the value to a Date object
  const date = new Date(rawValue as string | number);

  // Invalid date: render the raw value as text
  if (isNaN(date.getTime())) {
    return <DesignText text={String(rawValue)} css={css} />;
  }

  // Format the date using the element's format options
  return <DesignText text={formatDesignDate(date, element.format)} css={css} />;
};
