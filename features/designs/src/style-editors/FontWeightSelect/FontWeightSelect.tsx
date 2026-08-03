import { useCallback } from 'react';
import { FontWeight, fontWeights } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { Select, SelectItem } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { useScopedStyleKey } from '../StyleKeyScope';

export interface FontWeightSelectProps {
  /**
   * The ID of the element for which to edit the font weight.
   */
  elementId: string;
}

/**
 * Renders a select dropdown for choosing an element's font weight.
 */
export const FontWeightSelect = ({ elementId }: FontWeightSelectProps) => {
  const { t } = useTranslation();
  // Resolve the style keys against the current style key scope
  const styleKey = useScopedStyleKey('font-weight');
  const fontFamilyStyleKey = useScopedStyleKey('font-family');
  const fontWeight = useElementStyle(elementId, styleKey);
  const fontFamily = useElementStyle(elementId, fontFamilyStyleKey);

  const handleChange = useCallback(
    (value: FontWeight) => {
      updateElementStyle(elementId, styleKey, value);
    },
    [elementId, styleKey],
  );

  return (
    <Select
      variant="subtle"
      size="md"
      value={fontWeight}
      valueColor={fontWeight === 'inherit' ? 'muted' : 'regular'}
      onValueChange={handleChange}
      options={fontWeights.map((font) => ({
        label: t(font.label),
        value: font.value,
      }))}
    >
      {fontWeights.map((weight) => (
        <SelectItem
          key={weight.value}
          className={`weight-${weight.value} ${fontFamily}`}
          label={weight.label}
          value={weight.value}
        />
      ))}
    </Select>
  );
};
