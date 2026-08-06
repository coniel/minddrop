import { useCallback } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { ColorSelect, ColorSelectOption } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../DesignStudioStore';
import { useScopedStyleKey } from './StyleKeyScope';

export interface TextColorSelectProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Whether to show the inherit option.
   */
  showInherit?: boolean;

  /**
   * Optional i18n label key displayed above the select.
   */
  label?: TranslationKey;
}

const inheritOption: ColorSelectOption = {
  value: 'inherit',
  label: 'color.inherit',
  swatchClass: 'color-select-swatch-default',
};

/**
 * Renders a color select for an element's text color.
 */
export const TextColorSelect = ({
  elementId,
  showInherit = true,
  label,
}: TextColorSelectProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('color');
  const color = useElementStyle(elementId, styleKey);

  const handleChange = useCallback(
    (value: string) => {
      updateElementStyle(elementId, styleKey, value);
    },
    [elementId, styleKey],
  );

  return (
    <ColorSelect
      size="md"
      variant="subtle"
      label={label}
      value={color}
      valueColor={color === 'inherit' ? 'muted' : 'regular'}
      onValueChange={handleChange}
      extraOptions={showInherit ? [inheritOption] : undefined}
    />
  );
};
