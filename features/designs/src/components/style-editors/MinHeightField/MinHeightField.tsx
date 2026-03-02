import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface MinHeightFieldProps {
  elementId: string;
}

export const MinHeightField = ({ elementId }: MinHeightFieldProps) => {
  const minHeight = useElementStyle(elementId, 'minHeight');

  const handleChange = useCallback(
    (value: number | null) => {
      updateElementStyle(elementId, 'minHeight', value ?? undefined);
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={minHeight ?? null}
      onValueChange={handleChange}
      min={0}
      step={1}
      trailing="px"
    />
  );
};
