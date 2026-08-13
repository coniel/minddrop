import { useCallback } from 'react';
import { SwitchField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface StretchSwitchProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a switch for toggling the stretch behaviour
 * on a container element.
 */
export const StretchSwitch = ({ elementId }: StretchSwitchProps) => {
  const stretch = useElementStyle(elementId, 'stretch');

  const handleChange = useCallback(
    (checked: boolean) => {
      updateElementStyle(elementId, 'stretch', checked);
    },
    [elementId],
  );

  return (
    <SwitchField
      size="md"
      label="designs.stretch.label"
      checked={stretch}
      onCheckedChange={handleChange}
    />
  );
};
