import { useCallback } from 'react';
import { TextAlign, textAligns } from '@minddrop/designs';
import { ToggleGroup, ToggleGroupButton } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface TextAlignToggleProps {
  elementId: string;
}

export const TextAlignToggle = ({ elementId }: TextAlignToggleProps) => {
  const textAlign = useElementStyle(elementId, 'text-align');

  const handleSelect = useCallback(
    (value: TextAlign) => updateElementStyle(elementId, 'text-align', value),
    [elementId],
  );

  return (
    <ToggleGroup value={textAlign} onValueChange={handleSelect}>
      {textAligns.map((align) => (
        <ToggleGroupButton
          key={align.value}
          tooltipDescription={align.label}
          {...align}
        />
      ))}
    </ToggleGroup>
  );
};
