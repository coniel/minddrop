import { useCallback } from 'react';
import { Toggle } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { useScopedStyleKey } from '../StyleKeyScope';

export interface UnderlineToggleProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a toggle button for an element's underline style.
 */
export const UnderlineToggle = ({ elementId }: UnderlineToggleProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('underline');
  const underline = useElementStyle(elementId, styleKey);

  const handleToggle = useCallback(
    (checked: boolean) => updateElementStyle(elementId, styleKey, checked),
    [elementId, styleKey],
  );

  return (
    <Toggle
      label="designs.typography.underline"
      icon="underline"
      pressed={underline}
      onPressedChange={handleToggle}
    />
  );
};
