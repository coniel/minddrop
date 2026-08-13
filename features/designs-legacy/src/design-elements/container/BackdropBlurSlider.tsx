import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface BackdropBlurFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for adjusting the backdrop blur amount
 * on a container element.
 */
export const BackdropBlurField = ({ elementId }: BackdropBlurFieldProps) => {
  const backdropBlur = useElementStyle(elementId, 'backdropBlur');

  // Update the blur value
  const handleChange = useCallback(
    (value: number | null) => {
      updateElementStyle(elementId, 'backdropBlur', value ?? 0);
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={backdropBlur}
      onValueChange={handleChange}
      min={0}
      max={20}
      step={1}
      trailing="px"
    />
  );
};
