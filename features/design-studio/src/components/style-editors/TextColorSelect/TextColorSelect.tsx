import { useCallback } from 'react';
import { ColorSelect, ContentColor } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface TextColorSelectProps {
  elementId: string;
  showInherit?: boolean;
}

const inheritOption = {
  value: 'inherit',
  label: 'color.inherit',
  swatchClass: 'color-select-swatch-default',
};

export const TextColorSelect = ({ elementId, showInherit = true }: TextColorSelectProps) => {
  const color = useElementStyle(elementId, 'color') as ContentColor;

  const handleChange = useCallback(
    (value: ContentColor) => {
      updateElementStyle(elementId, 'color', value);
    },
    [elementId],
  );

  return (
    <ColorSelect
      size="md"
      variant="subtle"
      value={color}
      onValueChange={handleChange}
      extraOptions={showInherit ? [inheritOption] : undefined}
    />
  );
};
