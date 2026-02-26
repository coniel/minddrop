import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface OpacityFieldProps {
  elementId: string;
}

export const OpacityField = ({ elementId }: OpacityFieldProps) => {
  const opacity = useElementStyle(elementId, 'opacity');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'opacity', value / 100);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="sm"
      value={Math.round(opacity * 100)}
      onValueChange={handleChange}
      min={0}
      max={100}
      step={5}
      trailing="%"
    />
  );
};
