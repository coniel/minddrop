import { useCallback } from 'react';
import { NumberElement } from '@minddrop/designs';
import { NumberField } from '@minddrop/ui-primitives';
import { useDesignStudio, useElementData } from '../../DesignStudioStore';
import { FlatNumberElement } from '../../types';

export interface NumberContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for editing a static number element's
 * content.
 */
export const NumberContentField: React.FC<NumberContentFieldProps> = ({
  elementId,
}) => {
  const studio = useDesignStudio();
  const { content } = useElementData(
    elementId,
    (element: FlatNumberElement) => ({
      content: element.content || '',
    }),
  );

  // Element content is stored as text, so the numeric value is
  // parsed for the field and stringified back on change
  const numericValue = content ? Number(content) : null;

  const handleChange = useCallback(
    (value: number | null) => {
      studio.updateDesignElement<NumberElement>(elementId, {
        content: value !== null ? String(value) : '',
      });
    },
    [studio, elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={numericValue}
      onValueChange={handleChange}
      placeholder="designs.content.placeholder"
    />
  );
};
