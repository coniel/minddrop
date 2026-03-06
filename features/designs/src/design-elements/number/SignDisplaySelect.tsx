import { useCallback } from 'react';
import { NumberElement, SignDisplay } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { SelectField, SelectItem } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { FlatNumberElement, StyleOptions } from '../../types';

export interface SignDisplaySelectProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Optional i18n label key displayed above the select.
   */
  label?: string;
}

const options: StyleOptions<SignDisplay> = [
  { value: 'auto', label: 'designs.number-format.sign-display.auto' },
  { value: 'always', label: 'designs.number-format.sign-display.always' },
  { value: 'never', label: 'designs.number-format.sign-display.never' },
];

/**
 * Renders a select for choosing the sign display mode
 * on a number design element.
 */
export const SignDisplaySelect = ({ elementId, label }: SignDisplaySelectProps) => {
  const { t } = useTranslation();

  const { signDisplay: value } = useElementData(
    elementId,
    (element: FlatNumberElement) => ({
      signDisplay: element.format?.signDisplay ?? 'auto',
    }),
  );

  const handleChange = useCallback(
    (newValue: string) => {
      updateDesignElement<NumberElement>(elementId, {
        format: {
          signDisplay: newValue as SignDisplay,
        },
      });
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
