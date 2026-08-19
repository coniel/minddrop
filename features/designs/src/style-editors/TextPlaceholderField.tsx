import { useCallback, useRef, useState } from 'react';
import { generateLoremIpsum } from '@minddrop/designs';
import {
  Group,
  IconButton,
  Slider,
  Stack,
  TextField,
} from '@minddrop/ui-primitives';

export interface TextPlaceholderFieldProps {
  /**
   * The placeholder value.
   */
  value: string;

  /**
   * Callback fired when the placeholder value changes.
   */
  onValueChange: (value: string) => void;

  /**
   * Custom word count steps for the lorem ipsum slider.
   */
  wordCounts?: number[];
}

// The word counts the slider steps through, coarser as the text
// gets longer
const DefaultWordCounts = [
  1, 2, 3, 4, 5, 8, 10, 12, 14, 16, 20, 25, 30, 35, 40, 50, 60, 70, 80, 100,
  120, 140, 160, 200, 250, 300,
];

/**
 * Renders a text field with a lorem ipsum generator slider for
 * editing a text placeholder value.
 */
export const TextPlaceholderField: React.FC<TextPlaceholderFieldProps> = ({
  value,
  onValueChange,
  wordCounts = DefaultWordCounts,
}) => {
  // Start the slider at the step closest to the current text's
  // length, so it picks up where the value left off
  const [sliderStep, setSliderStep] = useState(() =>
    closestWordCountStep(value, wordCounts),
  );
  const previousStepRef = useRef(sliderStep);

  // Generate fresh text at the current length
  const handleReroll = useCallback(() => {
    if (sliderStep === 0) {
      return;
    }

    onValueChange(generateLoremIpsum(wordCounts[sliderStep - 1]));
  }, [onValueChange, sliderStep, wordCounts]);

  // Regenerate the placeholder whenever the length changes
  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const newStep = Array.isArray(step) ? step[0] : step;

      if (newStep === previousStepRef.current) {
        return;
      }

      previousStepRef.current = newStep;
      setSliderStep(newStep);

      // The first step means no placeholder at all
      if (newStep === 0) {
        onValueChange('');

        return;
      }

      onValueChange(generateLoremIpsum(wordCounts[newStep - 1]));
    },
    [onValueChange, wordCounts],
  );

  return (
    <Stack gap={4}>
      <Group gap={1}>
        <IconButton
          icon="refresh-cw"
          label="designs.placeholder.reroll"
          variant="subtle"
          size="md"
          disabled={sliderStep === 0}
          onClick={handleReroll}
        />
        <TextField
          variant="subtle"
          size="md"
          value={value}
          onValueChange={onValueChange}
          placeholder="designs.placeholder.placeholder"
        />
      </Group>
      <Slider
        size="md"
        min={0}
        max={wordCounts.length}
        step={1}
        value={sliderStep}
        onValueChange={handleSliderChange}
      />
    </Stack>
  );
};

/**
 * Finds the slider step whose word count is closest to the text's
 * actual length, so the slider reflects an existing placeholder.
 */
function closestWordCountStep(text: string, counts: number[]): number {
  if (!text) {
    return 0;
  }

  const count = text.trim().split(/\s+/).length;
  let closest = 0;

  for (let index = 0; index < counts.length; index++) {
    if (Math.abs(counts[index] - count) < Math.abs(counts[closest] - count)) {
      closest = index;
    }
  }

  return closest + 1;
}
