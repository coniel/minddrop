import { useCallback } from 'react';
import { SwitchField } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface WrapSwitchProps {
  elementId: string;
}

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
      size="sm"
      label="designs.wrap.label"
      checked={wrap}
      onCheckedChange={handleChange}
    />
  );
};
