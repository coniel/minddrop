import { useCallback } from 'react';
import { SwitchField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface WrapSwitchProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a switch for toggling flex wrap on a container element.
 */
export const WrapSwitch = ({ elementId }: WrapSwitchProps) => {
  const wrap = useElementStyle(elementId, 'wrap');

  const handleChange = useCallback(
    (checked: boolean) => {
      updateElementStyle(elementId, 'wrap', checked);
    },
    [elementId],
  );

  return (
    <SwitchField
      size="md"
      label="designs.wrap.label"
      checked={wrap}
      onCheckedChange={handleChange}
    />
  );
};
