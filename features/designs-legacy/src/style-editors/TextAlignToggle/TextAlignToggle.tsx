import { useCallback } from 'react';
import { TextAlign, textAligns } from '@minddrop/designs-legacy';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { useScopedStyleKey } from '../StyleKeyScope';

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
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('text-align');
  const textAlign = useElementStyle(elementId, styleKey);

  const handleSelect = useCallback(
    (value: TextAlign) => updateElementStyle(elementId, styleKey, value),
    [elementId, styleKey],
  );

  return (
    <RadioToggleGroup size="md" value={textAlign} onValueChange={handleSelect}>
      {textAligns.map((align) => (
        <Toggle key={align.value} {...align} label={t(align.label)} />
      ))}
    </RadioToggleGroup>
  );
};
