import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface BorderRadiusFieldProps {
  elementId: string;
}

export const BorderRadiusField = ({ elementId }: BorderRadiusFieldProps) => {
  const borderRadius = useElementStyle(elementId, 'borderRadius');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'borderRadius', value);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="sm"
      value={borderRadius}
      onValueChange={handleChange}
      min={0}
      max={100}
      step={1}
    />
  );
};
