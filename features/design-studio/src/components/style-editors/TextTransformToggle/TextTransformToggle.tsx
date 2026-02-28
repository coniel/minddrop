import { useCallback } from 'react';
import { TextTransform } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface TextTransformToggleProps {
  elementId: string;
}

const options: { value: TextTransform; label: string; children: string | null }[] = [
  { value: 'none', label: 'designs.typography.text-transform.none', children: null },
  { value: 'uppercase', label: 'designs.typography.text-transform.uppercase', children: 'designs.typography.text-transform.uppercase-short' },
  { value: 'lowercase', label: 'designs.typography.text-transform.lowercase', children: 'designs.typography.text-transform.lowercase-short' },
  { value: 'capitalize', label: 'designs.typography.text-transform.capitalize', children: 'designs.typography.text-transform.capitalize-short' },
];

export const TextTransformToggle = ({
  elementId,
}: TextTransformToggleProps) => {
  const { t } = useTranslation();
  const textTransform = useElementStyle(elementId, 'text-transform');

  const handleSelect = useCallback(
    (value: TextTransform) =>
      updateElementStyle(elementId, 'text-transform', value),
    [elementId],
  );

  return (
    <RadioToggleGroup value={textTransform} onValueChange={handleSelect}>
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} label={t(option.label)}>
          {option.children ? t(option.children) : null}
        </Toggle>
      ))}
    </RadioToggleGroup>
  );
};
