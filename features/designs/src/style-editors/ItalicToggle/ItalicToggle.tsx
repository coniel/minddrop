import { useCallback } from 'react';
import { Toggle } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { useScopedStyleKey } from '../StyleKeyScope';

export interface ItalicToggleProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a toggle button for an element's italic style.
 */
export const ItalicToggle = ({ elementId }: ItalicToggleProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('italic');
  const italic = useElementStyle(elementId, styleKey);

  const handleToggle = useCallback(
    (checked: boolean) => updateElementStyle(elementId, styleKey, checked),
    [elementId, styleKey],
  );

  return (
    <Toggle
      label="designs.typography.italic"
      icon="italic"
      pressed={italic}
      onPressedChange={handleToggle}
    />
  );
};
