import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Select, SelectItem } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatNumberElement } from '../../../types';

export interface SignDisplaySelectProps {
  elementId: string;
}

const options = [
  { value: 'auto', label: 'designs.number-format.sign-display.auto' },
  { value: 'always', label: 'designs.number-format.sign-display.always' },
  { value: 'never', label: 'designs.number-format.sign-display.never' },
] as const;

export const SignDisplaySelect = ({ elementId }: SignDisplaySelectProps) => {
  const { t } = useTranslation();

  const value = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatNumberElement)?.format?.signDisplay ??
      'auto',
  );

  const handleChange = useCallback(
    (newValue: string) => {
      updateDesignElement(elementId, {
        format: {
          signDisplay: newValue as 'auto' | 'always' | 'never',
        },
      });
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
