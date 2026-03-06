import { useCallback } from 'react';
import { ObjectFit } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { SelectField, SelectItem } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { StyleOptions } from '../../types';

export interface ObjectFitSelectProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Optional i18n label key displayed above the select.
   */
  label?: string;
}

const options: StyleOptions<ObjectFit> = [
  { value: 'cover', label: 'designs.image.sizing.object-fit.cover' },
  { value: 'contain', label: 'designs.image.sizing.object-fit.contain' },
  { value: 'fill', label: 'designs.image.sizing.object-fit.fill' },
];

/**
 * Renders a select for choosing the object-fit mode
 * on an image design element.
 */
export const ObjectFitSelect = ({ elementId, label }: ObjectFitSelectProps) => {
  const { t } = useTranslation();
  const value = useElementStyle(elementId, 'objectFit');

  const handleChange = useCallback(
    (newValue: string) => {
      updateElementStyle(elementId, 'objectFit', newValue as ObjectFit);
    },
    [elementId],
  );

  return (
    <SelectField
      variant="subtle"
      size="md"
      label={label}
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
    </SelectField>
  );
};
