import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface MaxWidthFieldProps {
  elementId: string;
}

export const MaxWidthField = ({ elementId }: MaxWidthFieldProps) => {
  const maxWidth = useElementStyle(elementId, 'max-width');

  const handleChange = useCallback(
    (value: number | null) => {
      updateElementStyle(elementId, 'max-width', value ?? 0);
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={maxWidth || null}
      onValueChange={handleChange}
      min={1}
      clearable
      max={9999}
      step={10}
      trailing="px"
      placeholder="designs.max-width.placeholder"
    />
  );
};
