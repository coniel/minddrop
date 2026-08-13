import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';
import { useScopedStyleKey } from './StyleKeyScope';

export interface MarginBottomFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for editing an element's bottom margin.
 */
export const MarginBottomField = ({ elementId }: MarginBottomFieldProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('margin-bottom');
  const marginBottom = useElementStyle(elementId, styleKey);

  const handleChange = useCallback(
    (value: number | null) => {
      if (value !== null) {
        updateElementStyle(elementId, styleKey, value / 16);
      }
    },
    [elementId, styleKey],
  );

  return (
    <NumberField
      variant="subtle"
      size="md"
      value={Math.round(marginBottom * 16)}
      onValueChange={handleChange}
      min={0}
      max={160}
      step={1}
      trailing="px"
    />
  );
};
