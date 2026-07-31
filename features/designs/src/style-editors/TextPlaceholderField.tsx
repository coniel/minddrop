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

const defaultWordCounts = [
  1, 2, 3, 4, 5, 8, 10, 12, 14, 16, 20, 25, 30, 35, 40, 50, 60, 70, 80, 100,
  120, 140, 160, 200, 250, 300,
];

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

/**
 * Renders a text field with a lorem ipsum generator slider for
 * editing a text placeholder value.
 */
export const TextPlaceholderField = ({
  value,
  onValueChange,
  wordCounts: wordCountsProp,
}: TextPlaceholderFieldProps) => {
  const wordCounts = wordCountsProp || defaultWordCounts;

  const [sliderStep, setSliderStep] = useState(() =>
    closestWordCountStep(value, wordCounts),
  );
  const generatedTextRef = useRef(value);

  const handleReroll = useCallback(() => {
    if (sliderStep === 0) {
      return;
    }

    const text = generateLoremIpsum(wordCounts[sliderStep - 1]);

    generatedTextRef.current = text;
    onValueChange(text);
  }, [onValueChange, sliderStep, wordCounts]);

  const previousStepRef = useRef(sliderStep);

  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const newStep = Array.isArray(step) ? step[0] : step;

      if (newStep === previousStepRef.current) {
        return;
      }

      previousStepRef.current = newStep;
      setSliderStep(newStep);

      if (newStep === 0) {
        generatedTextRef.current = '';
        onValueChange('');
      } else {
        const text = generateLoremIpsum(wordCounts[newStep - 1]);

        generatedTextRef.current = text;
        onValueChange(text);
      }
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
