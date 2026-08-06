import { useCallback } from 'react';
import { FontFamily, fonts } from '@minddrop/designs';
import { Select, SelectItem } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { useScopedStyleKey } from '../StyleKeyScope';

export interface FontFamilySelectProps {
  /**
   * The ID of the element for which to edit the font family.
   */
  elementId: string;
}

/**
 * Renders a select dropdown for choosing an element's font family.
 */
export const FontFamilySelect = ({ elementId }: FontFamilySelectProps) => {
  // Resolve the style key against the current style key scope
  const styleKey = useScopedStyleKey('font-family');
  const fontFamily = useElementStyle(elementId, styleKey);

  const handleChange = useCallback(
    (value: FontFamily) => {
      updateElementStyle(elementId, styleKey, value);
    },
    [elementId, styleKey],
  );

  return (
    <Select
      variant="subtle"
      size="md"
      value={fontFamily}
      valueColor={fontFamily === 'inherit' ? 'muted' : 'regular'}
      onValueChange={handleChange}
      options={fonts}
    >
      {fonts.map((font) => (
        <SelectItem
          key={font.value}
          className={`font-family-${font.value}`}
          label={font.label}
          value={font.value}
        />
      ))}
    </Select>
  );
};
