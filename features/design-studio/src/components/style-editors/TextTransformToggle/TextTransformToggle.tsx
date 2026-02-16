import { useCallback } from 'react';
import { TextTransform, textTransforms } from '@minddrop/designs';
import { ToggleGroup, ToggleGroupButton } from '@minddrop/ui-primitives';
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
    <ToggleGroup value={textTransform} onValueChange={handleSelect}>
      {textTransforms.map((transform) => (
        <ToggleGroupButton
          key={transform.value}
          tooltipDescription={transform.label}
          {...transform}
        />
      ))}
    </ToggleGroup>
  );
};
