import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';
import { useScopedStyleKey } from './StyleKeyScope';

export interface LetterSpacingFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for editing an element's letter spacing.
 */
export const LetterSpacingField = ({ elementId }: LetterSpacingFieldProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('letter-spacing');
  const letterSpacing = useElementStyle(elementId, styleKey);

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, styleKey, value / 100);
      }
    },
    [elementId, styleKey],
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
