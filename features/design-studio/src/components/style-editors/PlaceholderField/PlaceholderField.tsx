import { useCallback, useRef, useState } from 'react';
import {
  Group,
  IconButton,
  Slider,
  Stack,
  TextField,
} from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatTextElement } from '../../../types';
import { generateLoremIpsum } from '../../../utils';


export interface PlaceholderFieldProps {
  elementId: string;
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
    if (
      Math.abs(counts[index] - count) <
      Math.abs(counts[closest] - count)
    ) {
      closest = index;
    }
  }

  return closest + 1;
}

export const PlaceholderField = ({ elementId, wordCounts: wordCountsProp }: PlaceholderFieldProps) => {
  const wordCounts = wordCountsProp || defaultWordCounts;
  const placeholder = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatTextElement)?.placeholder || '',
  );

  const [sliderStep, setSliderStep] = useState(() =>
    closestWordCountStep(placeholder, wordCounts),
  );
  const generatedTextRef = useRef(placeholder);

  const handleReroll = useCallback(() => {
    if (sliderStep === 0) {
      return;
    }

    const text = generateLoremIpsum(wordCounts[sliderStep - 1]);

    generatedTextRef.current = text;
    updateDesignElement(elementId, { placeholder: text });
  }, [elementId, sliderStep]);

  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement(elementId, { placeholder: value });
    },
    [elementId],
  );

  const previousStepRef = useRef(sliderStep);

  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const value = Array.isArray(step) ? step[0] : step;

      if (value === previousStepRef.current) {
        return;
      }

      previousStepRef.current = value;
      setSliderStep(value);

      if (value === 0) {
        generatedTextRef.current = '';
        updateDesignElement(elementId, { placeholder: '' });
      } else {
        const text = generateLoremIpsum(wordCounts[value - 1]);

        generatedTextRef.current = text;
        updateDesignElement(elementId, { placeholder: text });
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
        <TextField
          variant="subtle"
          size="md"
          value={placeholder}
          onValueChange={handleChange}
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
