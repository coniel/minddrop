import { useCallback } from 'react';
import { NumberField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';
import { useScopedStyleKey } from './StyleKeyScope';

export interface FontSizeFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a number field for editing an element's font size.
 */
export const FontSizeField = ({ elementId }: FontSizeFieldProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('font-size');
  const fontSize = useElementStyle(elementId, styleKey);

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
      value={Math.round(fontSize * 16)}
      onValueChange={handleChange}
      min={4}
      max={160}
      step={1}
      trailing="px"
    />
  );
};
