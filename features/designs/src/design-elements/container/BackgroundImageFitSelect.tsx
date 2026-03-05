import { useCallback } from 'react';
import { ObjectFit } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { Select, SelectItem } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { StyleOptions } from '../../types';

export interface BackgroundImageFitSelectProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

const options: StyleOptions<ObjectFit> = [
  { value: 'cover', label: 'designs.background-image-fit.cover' },
  { value: 'contain', label: 'designs.background-image-fit.contain' },
  { value: 'fill', label: 'designs.background-image-fit.fill' },
];

/**
 * Renders a select for choosing the background image fit mode
 * on a container element.
 */
export const BackgroundImageFitSelect = ({
  elementId,
}: BackgroundImageFitSelectProps) => {
  const { t } = useTranslation();
  const value = useElementStyle(elementId, 'backgroundImageFit');

  const handleChange = useCallback(
    (newValue: string) => {
      updateElementStyle(
        elementId,
        'backgroundImageFit',
        newValue as ObjectFit,
      );
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
