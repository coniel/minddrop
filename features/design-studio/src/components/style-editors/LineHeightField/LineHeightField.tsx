import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface LineHeightFieldProps {
  elementId: string;
}

export const LineHeightField = ({ elementId }: LineHeightFieldProps) => {
  const lineHeight = useElementStyle(elementId, 'line-height');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'line-height', value / 100);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={Math.round(lineHeight * 100)}
      onValueChange={handleChange}
      min={50}
      max={500}
      step={5}
      trailing="%"
    />
  );
};
