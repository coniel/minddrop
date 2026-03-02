import { useCallback } from 'react';
import { Slider } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface BackdropBrightnessSliderProps {
  elementId: string;
}

export const BackdropBrightnessSlider = ({
  elementId,
}: BackdropBrightnessSliderProps) => {
  const backdropBrightness = useElementStyle(elementId, 'backdropBrightness');

  // Update the brightness value from the slider
  const handleChange = useCallback(
    (value: number | number[]) => {
      const brightnessValue = Array.isArray(value) ? value[0] : value;

      updateElementStyle(elementId, 'backdropBrightness', brightnessValue);
    },
    [elementId],
  );

  return (
    <div style={{ paddingLeft: 9, paddingRight: 9 }}>
      <Slider
        size="lg"
        value={backdropBrightness}
        onValueChange={handleChange}
        min={0}
        max={200}
        step={5}
        ariaLabel="Backdrop brightness"
      />
    </div>
  );
};
