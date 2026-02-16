import { useCallback } from 'react';
import { FontFamily, fonts } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { Select, SelectItem } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';

export interface FontFamilySelectProps {
  /**
   * The ID of the element for which to edit the font family.
   */
  elementId: string;
}

export const FontFamilySelect = ({ elementId }: FontFamilySelectProps) => {
  const { t } = useTranslation();
  const fontFamily = useElementStyle(elementId, 'font-family');

  const handleChange = useCallback(
    (value: FontFamily) => {
      updateElementStyle(elementId, 'font-family', value);
    },
    [elementId],
  );

  return (
    <Select
      value={fontFamily}
      onValueChange={handleChange}
      options={fonts.map((font) => ({
        label: t(font.label),
        value: font.value,
      }))}
    >
      {fonts.map((font) => (
        <SelectItem
          key={font.value}
          className={font.value}
          label={font.label}
          value={font.value}
        />
      ))}
    </Select>
  );
};
