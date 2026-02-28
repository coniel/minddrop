import { useCallback } from 'react';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  useDesignStudioStore,
} from '../../../DesignStudioStore';
import { FlatNumberElement } from '../../../types';

export interface ThousandsSeparatorSelectProps {
  elementId: string;
}

const options = [
  {
    value: 'none',
    label: 'designs.number-format.thousands-separator.none',
    children: '—',
  },
  {
    value: 'comma',
    label: 'designs.number-format.thousands-separator.comma',
    children: ',',
  },
  {
    value: 'period',
    label: 'designs.number-format.thousands-separator.period',
    children: '.',
  },
  {
    value: 'space',
    label: 'designs.number-format.thousands-separator.space',
    children: '␣',
  },
] as const;

export const ThousandsSeparatorSelect = ({
  elementId,
}: ThousandsSeparatorSelectProps) => {
  const value = useDesignStudioStore(
    (state) =>
      (state.elements[elementId] as FlatNumberElement)?.format
        ?.thousandsSeparator ?? 'none',
  );

  const handleChange = useCallback(
    (newValue: string) => {
      updateDesignElement(elementId, {
        format: {
          thousandsSeparator: newValue as
            | 'none'
            | 'comma'
            | 'period'
            | 'space',
        },
      });
    },
    [elementId],
  );

  return (
    <RadioToggleGroup
      size="md"
      value={value}
      onValueChange={handleChange}
    >
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} label={option.label}>
          {option.value === 'none' ? (
            option.children
          ) : (
            <span style={{ fontSize: '1.125rem', fontWeight: 600, transform: 'translateY(-6px)' }}>
              {option.children}
            </span>
          )}
        </Toggle>
      ))}
    </RadioToggleGroup>
  );
};
