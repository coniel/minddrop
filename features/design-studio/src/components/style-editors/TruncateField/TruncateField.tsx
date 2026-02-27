import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface TruncateFieldProps {
  elementId: string;
}

export const TruncateField = ({ elementId }: TruncateFieldProps) => {
  const truncate = useElementStyle(elementId, 'truncate');

  const handleChange = useCallback(
    (value: number | null) => {
      updateElementStyle(elementId, 'truncate', value ?? 0);
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={truncate || null}
      onValueChange={handleChange}
      min={1}
      clearable
      max={100}
      step={1}
      placeholder="designs.truncate.placeholder"
    />
  );
};
