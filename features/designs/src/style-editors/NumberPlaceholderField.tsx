import { useCallback, useRef, useState } from 'react';
import { generateNumberPlaceholder } from '@minddrop/designs';
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

// The largest number of digits the slider offers
const MaxDigitCount = 10;

/**
 * Renders a number field with a digit-count slider for editing a
 * number placeholder value.
 */
export const NumberPlaceholderField: React.FC<NumberPlaceholderFieldProps> = ({
  value,
  onValueChange,
}) => {
  // Start the slider at the current value's digit count
  const [digits, setDigits] = useState(() => digitCount(value));
  const previousDigitsRef = useRef(digits);

  const numericValue = value ? Number(value) : null;

  // Generate a fresh number of the same length
  const handleReroll = useCallback(() => {
    if (digits === 0) {
      return;
    }

    onValueChange(generateNumberPlaceholder(digits));
  }, [onValueChange, digits]);

  // Store the typed number as a string, since placeholders are
  // stored as text
  const handleChange = useCallback(
    (newValue: number | null) => {
      onValueChange(newValue !== null ? String(newValue) : '');
    },
    [onValueChange],
  );

  // Grow or shrink the value to the chosen digit count, keeping
  // the leading digits the user already has
  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const newDigits = Array.isArray(step) ? step[0] : step;

      if (newDigits === previousDigitsRef.current) {
        return;
      }

      previousDigitsRef.current = newDigits;
      setDigits(newDigits);

      // The first step means no placeholder at all
      if (newDigits === 0) {
        onValueChange('');

        return;
      }

      onValueChange(resizeNumber(value, newDigits));
    },
    [onValueChange, value],
  );

  return (
    <Stack gap={4}>
      <Group gap={1}>
        <IconButton
          icon="refresh-cw"
          label="designs.placeholder.reroll"
          variant="subtle"
          size="md"
          disabled={digits === 0}
          onClick={handleReroll}
        />
        <NumberField
          variant="subtle"
          size="md"
          value={numericValue}
          onValueChange={handleChange}
          placeholder="designs.placeholder.placeholder"
        />
      </Group>
      <Slider
        size="md"
        min={0}
        max={MaxDigitCount}
        step={1}
        value={digits}
        onValueChange={handleSliderChange}
      />
    </Stack>
  );
};

/**
 * Resizes a number string to the given digit count, padding with
 * zeroes to grow and truncating from the end to shrink.
 */
function resizeNumber(value: string, digits: number): string {
  const currentDigits = digitCount(value);

  // Nothing to resize from, so generate a fresh number
  if (!value) {
    return generateNumberPlaceholder(digits);
  }

  if (digits > currentDigits) {
    return value + '0'.repeat(digits - currentDigits);
  }

  return value.slice(0, digits);
}

/**
 * Counts the digits in a number placeholder string.
 */
function digitCount(value: string): number {
  return value.replace(/\D/g, '').length;
}
