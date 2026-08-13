import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';
import { useScopedStyleKey } from './StyleKeyScope';

export interface LineHeightFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for editing an element's line height.
 */
export const LineHeightField = ({ elementId }: LineHeightFieldProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('line-height');
  const lineHeight = useElementStyle(elementId, styleKey);

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
      value={Math.round(lineHeight * 100)}
      onValueChange={handleChange}
      min={50}
      max={500}
      step={5}
      trailing="%"
    />
  );
};
