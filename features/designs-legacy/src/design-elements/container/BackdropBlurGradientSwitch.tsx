import { useCallback } from 'react';
import { SwitchField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface BackdropBlurGradientSwitchProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a switch for toggling the backdrop blur gradient
 * on a container element.
 */
export const BackdropBlurGradientSwitch = ({
  elementId,
}: BackdropBlurGradientSwitchProps) => {
  const backdropBlurGradient = useElementStyle(
    elementId,
    'backdropBlurGradient',
  );

  const handleChange = useCallback(
    (checked: boolean) => {
      updateElementStyle(elementId, 'backdropBlurGradient', checked);
    },
    [elementId],
  );

  return (
    <SwitchField
      size="md"
      label="designs.backdrop-blur-gradient.label"
      checked={backdropBlurGradient}
      onCheckedChange={handleChange}
    />
  );
};
