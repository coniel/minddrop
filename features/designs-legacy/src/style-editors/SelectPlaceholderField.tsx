import { useCallback, useRef, useState } from 'react';
import { generateBadgePlaceholder } from '@minddrop/designs-legacy';
import {
  Group,
  IconButton,
  Slider,
  Stack,
  TextField,
} from '@minddrop/ui-primitives';

export interface SelectPlaceholderFieldProps {
  /**
   * The placeholder value as comma-separated badge labels.
   */
  value: string;

  /**
   * Callback fired when the placeholder value changes.
   */
  onValueChange: (value: string) => void;
}

/**
 * Counts the number of comma-separated segments in a placeholder string.
 */
function countBadges(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  return text.split(',').filter((segment) => segment.trim()).length;
}

/**
 * Editable select property placeholder field with a text input,
 * re-roll button, and slider to control the number of placeholder
 * badges.
 */
export const SelectPlaceholderField: React.FC<SelectPlaceholderFieldProps> = ({
  value,
  onValueChange,
}) => {
  // Track the slider value (badge count)
  const [sliderValue, setSliderValue] = useState(() => countBadges(value));
  const previousSliderRef = useRef(sliderValue);

  // Re-roll generates new random labels at the current count
  const handleReroll = useCallback(() => {
    if (sliderValue === 0) {
      return;
    }

    onValueChange(generateBadgePlaceholder(sliderValue));
  }, [onValueChange, sliderValue]);

  // Direct text editing
  const handleChange = useCallback(
    (newValue: string) => {
      onValueChange(newValue);

      // Keep slider in sync with the typed badge count
      setSliderValue(countBadges(newValue));
    },
    [onValueChange],
  );

  // Slider changes regenerate the placeholder with the new count
  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const newValue = Array.isArray(step) ? step[0] : step;

      if (newValue === previousSliderRef.current) {
        return;
      }

      previousSliderRef.current = newValue;
      setSliderValue(newValue);

      if (newValue === 0) {
        onValueChange('');
      } else {
        onValueChange(generateBadgePlaceholder(newValue));
      }
    },
    [onValueChange],
  );

  return (
    <Stack gap={4}>
      <Group gap={1}>
        <IconButton
          icon="refresh-cw"
          label="designs.placeholder.reroll"
          size="sm"
          disabled={sliderValue === 0}
          onClick={handleReroll}
        />
        <TextField
          variant="subtle"
          size="md"
          value={value}
          onValueChange={handleChange}
          placeholder="designs.select.placeholder.label"
        />
      </Group>
      <Slider
        size="md"
        min={0}
        max={10}
        step={1}
        value={sliderValue}
        onValueChange={handleSliderChange}
      />
    </Stack>
  );
};
