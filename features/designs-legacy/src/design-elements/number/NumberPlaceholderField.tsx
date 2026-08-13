import { useCallback, useRef, useState } from 'react';
import { generateNumberPlaceholder } from '@minddrop/designs-legacy';
import {
  Group,
  IconButton,
  NumberField,
  Slider,
  Stack,
} from '@minddrop/ui-primitives';

export interface NumberPlaceholderFieldProps {
  /**
   * The placeholder value.
   */
  value: string;

  /**
   * Callback fired when the placeholder value changes.
   */
  onValueChange: (value: string) => void;
}

function digitCount(value: string): number {
  const digits = value.replace(/\D/g, '');

  return digits.length || 0;
}

/**
 * Renders an editable number placeholder field with a number
 * input, re-roll button, and slider to control the number of
 * placeholder digits.
 */
export const NumberPlaceholderField = ({
  value,
  onValueChange,
}: NumberPlaceholderFieldProps) => {
  const numericValue = value ? Number(value) : null;

  const [sliderStep, setSliderStep] = useState(() => digitCount(value));
  const previousStepRef = useRef(sliderStep);

  const handleReroll = useCallback(() => {
    if (sliderStep === 0) {
      return;
    }

    onValueChange(generateNumberPlaceholder(sliderStep));
  }, [onValueChange, sliderStep]);

  const handleChange = useCallback(
    (newValue: number | null) => {
      onValueChange(newValue !== null ? String(newValue) : '');
    },
    [onValueChange],
  );

  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const newStep = Array.isArray(step) ? step[0] : step;

      if (newStep === previousStepRef.current) {
        return;
      }

      previousStepRef.current = newStep;
      setSliderStep(newStep);

      if (newStep === 0) {
        onValueChange('');

        return;
      }

      const currentDigits = digitCount(value);

      if (newStep > currentDigits) {
        // Add 0s to the end
        const padded = value
          ? value + '0'.repeat(newStep - currentDigits)
          : generateNumberPlaceholder(newStep);

        onValueChange(padded);
      } else if (newStep < currentDigits) {
        // Cut off digits from the end
        onValueChange(value.slice(0, newStep));
      }
    },
    [onValueChange, value],
  );

  return (
    <Stack gap={4}>
      <Group gap={1}>
        <IconButton
          icon="refresh-cw"
          label="designs.placeholder.reroll"
          size="sm"
          disabled={sliderStep === 0}
          onClick={handleReroll}
        />
        <NumberField
          variant="subtle"
          size="md"
          value={numericValue}
          onValueChange={handleChange}
          min={0}
          step={1}
          placeholder="designs.placeholder.placeholder"
        />
      </Group>
      <Slider
        size="md"
        min={0}
        max={10}
        step={1}
        value={sliderStep}
        onValueChange={handleSliderChange}
      />
    </Stack>
  );
};
