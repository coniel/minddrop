import { useCallback } from 'react';
import { Slider } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface BackdropBlurGradientExtentSliderProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a slider for adjusting the backdrop blur gradient
 * extent on a container element.
 */
export const BackdropBlurGradientExtentSlider = ({
  elementId,
}: BackdropBlurGradientExtentSliderProps) => {
  const extent = useElementStyle(elementId, 'backdropBlurGradientExtent');

  // Update the gradient extent value from the slider
  const handleChange = useCallback(
    (value: number | number[]) => {
      const extentValue = Array.isArray(value) ? value[0] : value;

      updateElementStyle(elementId, 'backdropBlurGradientExtent', extentValue);
    },
    [elementId],
  );

  return (
    <div style={{ paddingLeft: 9, paddingRight: 9 }}>
      <Slider
        size="lg"
        value={extent}
        onValueChange={handleChange}
        min={0}
        max={100}
        step={5}
        ariaLabel="Backdrop blur gradient extent"
      />
    </div>
  );
};
