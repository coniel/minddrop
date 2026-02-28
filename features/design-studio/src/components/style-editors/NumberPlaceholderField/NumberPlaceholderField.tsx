import { useCallback, useRef, useState } from 'react';
import {
  Group,
  IconButton,
  NumberField,
  Slider,
  Stack,
} from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatNumberElement } from '../../../types';

export interface NumberPlaceholderFieldProps {
  elementId: string;
}

function randomWithDigits(digits: number): number {
  if (digits <= 0) {
    return 0;
  }

  if (digits === 1) {
    return Math.floor(Math.random() * 9) + 1;
  }

  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function digitCount(value: string): number {
  const digits = value.replace(/\D/g, '');

  return digits.length || 0;
}

export const NumberPlaceholderField = ({
  elementId,
}: NumberPlaceholderFieldProps) => {
  const placeholder = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatNumberElement)?.placeholder || '',
  );

  const numericValue = placeholder ? Number(placeholder) : null;

  const [sliderStep, setSliderStep] = useState(() => digitCount(placeholder));
  const previousStepRef = useRef(sliderStep);

  const handleReroll = useCallback(() => {
    if (sliderStep === 0) {
      return;
    }

    const value = randomWithDigits(sliderStep);

    updateDesignElement(elementId, { placeholder: String(value) });
  }, [elementId, sliderStep]);

  const handleChange = useCallback(
    (value: number | null) => {
      updateDesignElement(elementId, {
        placeholder: value !== null ? String(value) : '',
      });
    },
    [elementId],
  );

  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const value = Array.isArray(step) ? step[0] : step;

      if (value === previousStepRef.current) {
        return;
      }

      previousStepRef.current = value;
      setSliderStep(value);

      if (value === 0) {
        updateDesignElement(elementId, { placeholder: '' });

        return;
      }

      const current = useDesignStudioStore.getState().elements[elementId] as
        | FlatNumberElement
        | undefined;
      const currentValue = current?.placeholder || '';
      const currentDigits = digitCount(currentValue);

      if (value > currentDigits) {
        // Add 0s to the end
        const padded = currentValue
          ? currentValue + '0'.repeat(value - currentDigits)
          : String(randomWithDigits(value));

        updateDesignElement(elementId, { placeholder: padded });
      } else if (value < currentDigits) {
        // Cut off digits from the end
        const trimmed = currentValue.slice(0, value);

        updateDesignElement(elementId, { placeholder: trimmed });
      }
    },
    [elementId],
  );

  return (
    <Stack gap={3}>
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
