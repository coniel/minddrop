import { useCallback, useRef, useState } from 'react';
import { BadgesElement, generateBadgePlaceholder } from '@minddrop/designs';
import {
  Group,
  IconButton,
  Slider,
  Stack,
  TextField,
} from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { FlatBadgesElement } from '../../types';

export interface BadgesPlaceholderFieldProps {
  /**
   * The ID of the badges element to edit.
   */
  elementId: string;
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
 * Editable placeholder field for badges design elements.
 * Provides a text input, re-roll button, and slider to control
 * the number of placeholder badges.
 */
export const BadgesPlaceholderField: React.FC<BadgesPlaceholderFieldProps> = ({
  elementId,
}) => {
  // Read current placeholder from the store
  const { placeholder } = useElementData(
    elementId,
    (element: FlatBadgesElement) => ({
      placeholder: element.placeholder || '',
    }),
  );

  // Track the slider value (badge count)
  const [sliderValue, setSliderValue] = useState(() =>
    countBadges(placeholder),
  );
  const previousSliderRef = useRef(sliderValue);

  // Re-roll generates new random labels at the current count
  const handleReroll = useCallback(() => {
    if (sliderValue === 0) {
      return;
    }

    const text = generateBadgePlaceholder(sliderValue);

    updateDesignElement<BadgesElement>(elementId, { placeholder: text });
  }, [elementId, sliderValue]);

  // Direct text editing
  const handleChange = useCallback(
    (value: string) => {
      updateDesignElement<BadgesElement>(elementId, { placeholder: value });

      // Keep slider in sync with the typed badge count
      setSliderValue(countBadges(value));
    },
    [elementId],
  );

  // Slider changes regenerate the placeholder with the new count
  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const value = Array.isArray(step) ? step[0] : step;

      if (value === previousSliderRef.current) {
        return;
      }

      previousSliderRef.current = value;
      setSliderValue(value);

      if (value === 0) {
        updateDesignElement<BadgesElement>(elementId, { placeholder: '' });
      } else {
        const text = generateBadgePlaceholder(value);

        updateDesignElement<BadgesElement>(elementId, { placeholder: text });
      }
    },
    [elementId],
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
          value={placeholder}
          onValueChange={handleChange}
          placeholder="designs.badges.placeholder.label"
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
