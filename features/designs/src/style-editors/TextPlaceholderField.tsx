import { useCallback, useRef, useState } from 'react';
import { TextElement, generateLoremIpsum } from '@minddrop/designs';
import {
  Group,
  IconButton,
  Slider,
  Stack,
  TextField,
} from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../DesignStudioStore';
import { FlatTextElement } from '../types';

export interface TextPlaceholderFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

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
 * editing an element's placeholder text.
 */
export const TextPlaceholderField = ({
  elementId,
  wordCounts: wordCountsProp,
}: TextPlaceholderFieldProps) => {
  const wordCounts = wordCountsProp || defaultWordCounts;
  const { placeholder } = useElementData(
    elementId,
    (element: FlatTextElement) => ({
      placeholder: element.placeholder || '',
    }),
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
    updateDesignElement<TextElement>(elementId, { placeholder: text });
  }, [elementId, sliderStep, wordCounts]);

  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement<TextElement>(elementId, { placeholder: value });
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
        updateDesignElement<TextElement>(elementId, { placeholder: '' });
      } else {
        const text = generateLoremIpsum(wordCounts[value - 1]);

        generatedTextRef.current = text;
        updateDesignElement<TextElement>(elementId, { placeholder: text });
      }
    },
    [elementId, wordCounts],
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
