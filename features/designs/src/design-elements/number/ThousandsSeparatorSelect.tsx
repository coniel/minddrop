import { useCallback } from 'react';
import { NumberElement, ThousandsSeparator } from '@minddrop/designs';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { FlatNumberElement, StyleOption } from '../../types';

export interface ThousandsSeparatorSelectProps {
  elementId: string;
}

const options: (StyleOption<ThousandsSeparator> & {
  children: string;
})[] = [
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
];

export const ThousandsSeparatorSelect = ({
  elementId,
}: ThousandsSeparatorSelectProps) => {
  const { thousandsSeparator: value } = useElementData(
    elementId,
    (element: FlatNumberElement) => ({
      thousandsSeparator: element.format?.thousandsSeparator ?? 'none',
    }),
  );

  const handleChange = useCallback(
    (newValue: string) => {
      updateDesignElement<NumberElement>(elementId, {
        format: {
          thousandsSeparator: newValue as ThousandsSeparator,
        },
      });
    },
    [elementId],
  );

  return (
    <RadioToggleGroup size="md" value={value} onValueChange={handleChange}>
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} label={option.label}>
          {option.value === 'none' ? (
            option.children
          ) : (
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                transform: 'translateY(-6px)',
              }}
            >
              {option.children}
            </span>
          )}
        </Toggle>
      ))}
    </RadioToggleGroup>
  );
};
