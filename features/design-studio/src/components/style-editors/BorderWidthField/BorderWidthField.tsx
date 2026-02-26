import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface BorderWidthFieldProps {
  elementId: string;
}

export const BorderWidthField = ({ elementId }: BorderWidthFieldProps) => {
  const borderWidth = useElementStyle(elementId, 'borderWidth');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'borderWidth', value);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="sm"
      value={borderWidth}
      onValueChange={handleChange}
      min={0}
      max={20}
      step={1}
    />
  );
};
