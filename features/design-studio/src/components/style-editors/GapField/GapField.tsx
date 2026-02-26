import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface GapFieldProps {
  elementId: string;
}

export const GapField = ({ elementId }: GapFieldProps) => {
  const gap = useElementStyle(elementId, 'gap');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'gap', value);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="sm"
      value={gap}
      onValueChange={handleChange}
      min={0}
      max={100}
      step={1}
    />
  );
};
