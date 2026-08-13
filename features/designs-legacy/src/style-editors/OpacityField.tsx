import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';
import { useScopedStyleKey } from './StyleKeyScope';

export interface OpacityFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for editing an element's opacity.
 */
export const OpacityField = ({ elementId }: OpacityFieldProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('opacity');
  const opacity = useElementStyle(elementId, styleKey);

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
      value={Math.round(opacity * 100)}
      onValueChange={handleChange}
      min={0}
      max={100}
      step={5}
      trailing="%"
    />
  );
};
