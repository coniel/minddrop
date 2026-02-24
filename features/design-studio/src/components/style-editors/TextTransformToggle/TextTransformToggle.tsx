import { useCallback } from 'react';
import { TextTransform, textTransforms } from '@minddrop/designs';
import { RadioToggleGroup, Toggle, ToggleGroup } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface TextTransformToggleProps {
  elementId: string;
}

export const TextTransformToggle = ({
  elementId,
}: TextTransformToggleProps) => {
  const textTransform = useElementStyle(elementId, 'text-transform');

  const handleSelect = useCallback(
    (value: TextTransform) =>
      updateElementStyle(elementId, 'text-transform', value),
    [elementId],
  );

  return (
    <RadioToggleGroup value={textTransform} onValueChange={handleSelect}>
      {textTransforms.map((transform) => (
        <Toggle
          key={transform.value}
          tooltipDescription={transform.label}
          {...transform}
        />
      ))}
    </RadioToggleGroup>
  );
};
