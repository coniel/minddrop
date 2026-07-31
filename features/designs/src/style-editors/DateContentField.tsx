import { useCallback } from 'react';
import { DateElement } from '@minddrop/designs';
import { updateDesignElement, useElementData } from '../DesignStudioStore';
import { DatePlaceholderField } from '../design-elements/date/DatePlaceholderField';
import { FlatDateElement } from '../types';

export interface DateContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a date input for editing a static date element's
 * content.
 */
export const DateContentField: React.FC<DateContentFieldProps> = ({
  elementId,
}) => {
  const { content } = useElementData(elementId, (element: FlatDateElement) => ({
    content: element.content || '',
  }));

  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement<DateElement>(elementId, { content: value });
    },
    [elementId],
  );

  return <DatePlaceholderField value={content} onValueChange={handleChange} />;
};
