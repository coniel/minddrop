import { useCallback } from 'react';
import { ColorSelect, ContentColor } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface BorderColorSelectProps {
  elementId: string;
}

export const BorderColorSelect = ({ elementId }: BorderColorSelectProps) => {
  const borderColor = useElementStyle(
    elementId,
    'borderColor',
  ) as ContentColor;

  const handleChange = useCallback(
    (value: ContentColor) => {
      updateElementStyle(elementId, 'borderColor', value);
    },
    [elementId],
  );

  return (
    <ColorSelect
      variant="subtle"
      value={borderColor}
      onValueChange={handleChange}
    />
  );
};
