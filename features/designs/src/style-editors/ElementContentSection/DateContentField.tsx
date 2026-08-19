import { useCallback } from 'react';
import { DateElement } from '@minddrop/designs';
import { useDesignStudio, useElementData } from '../../DesignStudioStore';
import { FlatDateElement } from '../../types';
import { DatePlaceholderField } from '../DatePlaceholderField';

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
  const studio = useDesignStudio();
  const { content } = useElementData(elementId, (element: FlatDateElement) => ({
    content: element.content || '',
  }));

  const handleChange = useCallback(
    (value: string) => {
      studio.updateDesignElement<DateElement>(elementId, { content: value });
    },
    [studio, elementId],
  );

  return <DatePlaceholderField value={content} onValueChange={handleChange} />;
};
