import { DesignElementProps } from '@minddrop/designs-next';
import { useElementProperty } from '@minddrop/ui-designs-next';
import { formatDateInMode, toDate } from '@minddrop/utils';
import { TextElementRenderer } from '../../TextElement';
import { DateElement } from '../DateElement.types';
import {
  DefaultDateMode,
  DefaultDateShowTime,
  DefaultDateStyle,
} from '../constants';

/**
 * Renders a date element as the date property it maps to, formatted
 * in the element's format.
 */
export const DateElementRenderer: React.FC<DesignElementProps<DateElement>> = ({
  element,
}) => {
  // Read the property the element maps to
  const property = useElementProperty(element);

  // Resolve the date to format, the current date while unmapped
  const date = property ? toDate(property.value) : new Date();

  // Format the date in the element's format, empty without a date
  const text = date
    ? formatDateInMode(date, {
        mode: element.mode ?? DefaultDateMode,
        style: element.dateStyle ?? DefaultDateStyle,
        time: element.showTime ?? DefaultDateShowTime,
      })
    : '';

  // Render the date as one line of text
  return <TextElementRenderer element={element} text={text} truncate />;
};
