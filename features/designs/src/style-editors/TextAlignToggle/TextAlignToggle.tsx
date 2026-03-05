import { useCallback } from 'react';
import { TextAlign, textAligns } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface TextAlignToggleProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders a toggle group for selecting an element's text alignment.
 */
export const TextAlignToggle = ({ elementId }: TextAlignToggleProps) => {
  const { t } = useTranslation();
  const textAlign = useElementStyle(elementId, 'text-align');

  const handleSelect = useCallback(
    (value: TextAlign) => updateElementStyle(elementId, 'text-align', value),
    [elementId],
  );

  return (
    <RadioToggleGroup size="md" value={textAlign} onValueChange={handleSelect}>
      {textAligns.map((align) => (
        <Toggle key={align.value} {...align} label={t(align.label)} />
      ))}
    </RadioToggleGroup>
  );
};
