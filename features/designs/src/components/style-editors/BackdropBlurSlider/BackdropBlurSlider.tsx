import { useCallback } from 'react';
import { Slider } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface BackdropBlurSliderProps {
  elementId: string;
}

export const BackdropBlurSlider = ({ elementId }: BackdropBlurSliderProps) => {
  const backdropBlur = useElementStyle(elementId, 'backdropBlur');

  // Update the blur value from the slider
  const handleChange = useCallback(
    (value: number | number[]) => {
      const blurValue = Array.isArray(value) ? value[0] : value;

      updateElementStyle(elementId, 'backdropBlur', blurValue);
    },
    [elementId],
  );

  return (
    <div style={{ paddingLeft: 9, paddingRight: 9 }}>
      <Slider
        size="lg"
        value={backdropBlur}
        onValueChange={handleChange}
        min={0}
        max={20}
        step={1}
        ariaLabel="Backdrop blur"
      />
    </div>
  );
};
