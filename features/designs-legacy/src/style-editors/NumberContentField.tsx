import { useCallback } from 'react';
import { NumberElement } from '@minddrop/designs-legacy';
import { NumberField } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../DesignStudioStore';
import { FlatNumberElement } from '../types';

export interface NumberContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number input for editing a static number element's
 * content.
 */
export const NumberContentField: React.FC<NumberContentFieldProps> = ({
  elementId,
}) => {
  const { content } = useElementData(
    elementId,
    (element: FlatNumberElement) => ({
      content: element.content || '',
    }),
  );

  const numericValue = content ? Number(content) : null;

  const handleChange = useCallback(
    (value: number | null) => {
      updateDesignElement<NumberElement>(elementId, {
        content: value !== null ? String(value) : '',
      });
    },
    [elementId],
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
