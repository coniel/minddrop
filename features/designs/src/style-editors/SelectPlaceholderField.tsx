import { useCallback, useRef, useState } from 'react';
import { generateBadgePlaceholder } from '@minddrop/designs';
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

// The largest number of placeholder badges the slider offers
const MaxBadgeCount = 10;

/**
 * Renders a text field with a generator slider for editing a
 * select property's placeholder, which is a comma-separated list
 * of badge labels.
 */
export const SelectPlaceholderField: React.FC<SelectPlaceholderFieldProps> = ({
  value,
  onValueChange,
}) => {
  // Start the slider at the number of badges already listed
  const [badgeCount, setBadgeCount] = useState(() => countBadges(value));
  const previousCountRef = useRef(badgeCount);

  // Generate fresh labels at the current count
  const handleReroll = useCallback(() => {
    if (badgeCount === 0) {
      return;
    }

    onValueChange(generateBadgePlaceholder(badgeCount));
  }, [onValueChange, badgeCount]);

  // Keep the slider in step with directly typed labels
  const handleChange = useCallback(
    (newValue: string) => {
      onValueChange(newValue);
      setBadgeCount(countBadges(newValue));
    },
    [onValueChange],
  );

  // Regenerate the labels whenever the count changes
  const handleSliderChange = useCallback(
    (step: number | number[]) => {
      const newCount = Array.isArray(step) ? step[0] : step;

      if (newCount === previousCountRef.current) {
        return;
      }

      previousCountRef.current = newCount;
      setBadgeCount(newCount);

      // The first step means no placeholder at all
      if (newCount === 0) {
        onValueChange('');

        return;
      }

      onValueChange(generateBadgePlaceholder(newCount));
    },
    [onValueChange],
  );

  return (
    <Stack gap={4}>
      <Group gap={1}>
        <IconButton
          icon="refresh-cw"
          label="designs.placeholder.reroll"
          variant="subtle"
          size="md"
          disabled={badgeCount === 0}
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
        max={MaxBadgeCount}
        step={1}
        value={badgeCount}
        onValueChange={handleSliderChange}
      />
    </Stack>
  );
};

/**
 * Counts the non-empty comma-separated labels in a placeholder.
 */
function countBadges(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  return text.split(',').filter((segment) => segment.trim()).length;
}
