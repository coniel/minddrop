import { DateElement, createTextCssStyle } from '@minddrop/designs';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { formatDesignDate } from './formatDesignDate';

export interface DateDesignElementProps {
  /**
   * The date element to render.
   */
  element: DateElement;
}

/**
 * Display renderer for a date design element.
 * Shows the mapped property value when available,
 * otherwise falls back to the placeholder date.
 * Formats the date using the element's format options.
 */
export const DateDesignElement: React.FC<DateDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);

  // Use the mapped property value if available, otherwise the placeholder
  const rawValue =
    property?.value != null ? property.value : element.placeholder;

  const baseStyle = createTextCssStyle(element.style);

  // No value at all - render empty placeholder
  if (!rawValue) {
    return <span style={baseStyle} />;
  }

  // Parse the value to a Date object
  const date = new Date(rawValue as string | number);

  // Invalid date - render the raw value as text
  if (isNaN(date.getTime())) {
    const text = String(rawValue);

    return (
      <span style={baseStyle} data-placeholder={text}>
        {text}
      </span>
    );
  }

  // Format the date using the element's format options
  const formatted = formatDesignDate(date, element.format);

  return (
    <span style={baseStyle} data-placeholder={formatted}>
      {formatted}
    </span>
  );
};
