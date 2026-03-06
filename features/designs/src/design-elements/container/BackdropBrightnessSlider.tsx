import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface BackdropBrightnessFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for adjusting the backdrop brightness
 * on a container element.
 */
export const BackdropBrightnessField = ({
  elementId,
}: BackdropBrightnessFieldProps) => {
  const backdropBrightness = useElementStyle(elementId, 'backdropBrightness');

  // Update the brightness value
  const handleChange = useCallback(
    (value: number | null) => {
      updateElementStyle(elementId, 'backdropBrightness', value ?? 0);
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={backdropBrightness}
      onValueChange={handleChange}
      min={0}
      max={200}
      step={5}
      trailing="%"
    />
  );
};
