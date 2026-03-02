import { useCallback } from 'react';
import { SwitchField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface StretchSwitchProps {
  elementId: string;
}

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
