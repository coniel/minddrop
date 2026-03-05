import { useCallback } from 'react';
import { Toggle } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

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
  const underline = useElementStyle(elementId, 'underline');

  const handleToggle = useCallback(
    (checked: boolean) => updateElementStyle(elementId, 'underline', checked),
    [elementId],
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
