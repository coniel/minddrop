import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface PaddingFieldProps {
  elementId: string;
}

export const PaddingField = ({ elementId }: PaddingFieldProps) => {
  const padding = useElementStyle(elementId, 'padding');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'padding', value);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={padding}
      onValueChange={handleChange}
      min={0}
      max={100}
      step={1}
      trailing="px"
    />
  );
};
