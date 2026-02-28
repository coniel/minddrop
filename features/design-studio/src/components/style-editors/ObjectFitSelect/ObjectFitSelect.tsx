import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { ObjectFit } from '@minddrop/designs';
import { Select, SelectItem } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface ObjectFitSelectProps {
  elementId: string;
}

const options = [
  { value: 'cover', label: 'designs.image.sizing.object-fit.cover' },
  { value: 'contain', label: 'designs.image.sizing.object-fit.contain' },
  { value: 'fill', label: 'designs.image.sizing.object-fit.fill' },
] as const;

export const ObjectFitSelect = ({ elementId }: ObjectFitSelectProps) => {
  const { t } = useTranslation();
  const value = useElementStyle(elementId, 'objectFit');

  const handleChange = useCallback(
    (newValue: string) => {
      updateElementStyle(elementId, 'objectFit', newValue as ObjectFit);
    },
    [elementId],
  );

  return (
    <Select
      variant="subtle"
      value={value}
      onValueChange={handleChange}
      options={options.map((option) => ({
        label: t(option.label),
        value: option.value,
      }))}
    >
      {options.map((option) => (
        <SelectItem
          key={option.value}
          label={option.label}
          value={option.value}
        />
      ))}
    </Select>
  );
};
