import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface GapFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number input for adjusting the gap between
 * children in a container element.
 */
export const GapField = ({ elementId }: GapFieldProps) => {
  const gap = useElementStyle(elementId, 'gap');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'gap', value);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={gap}
      onValueChange={handleChange}
      min={0}
      max={100}
      step={1}
      trailing="px"
    />
  );
};
