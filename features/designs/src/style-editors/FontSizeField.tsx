import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';

export interface FontSizeFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for editing an element's font size.
 */
export const FontSizeField = ({ elementId }: FontSizeFieldProps) => {
  const fontSize = useElementStyle(elementId, 'font-size');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'font-size', value / 16);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={Math.round(fontSize * 16)}
      onValueChange={handleChange}
      min={4}
      max={160}
      step={1}
      trailing="px"
    />
  );
};
