import { useCallback } from 'react';
import { FontWeight, fontWeights } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { Select, SelectItem } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface FontWeightSelectProps {
  /**
   * The ID of the element for which to edit the font weight.
   */
  elementId: string;
}

export const FontWeightSelect = ({ elementId }: FontWeightSelectProps) => {
  const { t } = useTranslation();
  const fontWeight = useElementStyle(elementId, 'font-weight');
  const fontFamily = useElementStyle(elementId, 'font-family');

  const handleChange = useCallback(
    (value: FontWeight) => {
      updateElementStyle(elementId, 'font-weight', value);
    },
    [elementId],
  );

  return (
    <Select
      variant="subtle"
      value={fontWeight}
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
