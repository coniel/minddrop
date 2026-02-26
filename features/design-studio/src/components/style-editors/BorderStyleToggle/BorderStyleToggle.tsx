import { useCallback } from 'react';
import { BorderStyle, borderStyles } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface BorderStyleToggleProps {
  elementId: string;
}

export const BorderStyleToggle = ({ elementId }: BorderStyleToggleProps) => {
  const { t } = useTranslation();
  const borderStyle = useElementStyle(elementId, 'borderStyle');

  const handleSelect = useCallback(
    (value: BorderStyle) => {
      updateElementStyle(elementId, 'borderStyle', value);
    },
    [elementId],
  );

  return (
    <RadioToggleGroup
      size="md"
      value={borderStyle}
      onValueChange={handleSelect}
    >
      {borderStyles.map((style) => (
        <Toggle key={style.value} {...style} label={t(style.label)} />
      ))}
    </RadioToggleGroup>
  );
};
