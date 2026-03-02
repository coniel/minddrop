import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface LetterSpacingFieldProps {
  elementId: string;
}

export const LetterSpacingField = ({ elementId }: LetterSpacingFieldProps) => {
  const letterSpacing = useElementStyle(elementId, 'letter-spacing');

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, 'letter-spacing', value / 100);
      }
    },
    [elementId],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={Math.round(letterSpacing * 100)}
      onValueChange={handleChange}
      min={-10}
      max={100}
      step={1}
      trailing="%"
    />
  );
};
