import { useCallback } from 'react';
import {
  NumberPropertyElement,
  SignDisplay,
  ThousandsSeparator,
} from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import {
  FlexItem,
  Group,
  InputLabel,
  NumberField,
  RadioToggleGroup,
  SelectField,
  SelectItem,
  Stack,
  TextField,
  Toggle,
} from '@minddrop/ui-primitives';
import { useDesignStudio, useElementData } from '../../DesignStudioStore';
import { FlatNumberPropertyElement } from '../../types';
import { PanelSection } from '../PanelSection';
import './NumberFormatFields.css';

// The thousands separator options, each shown as the character it
// inserts rather than its name
const SeparatorOptions: {
  value: ThousandsSeparator;
  label: TranslationKey;
  character: string;
}[] = [
  {
    value: 'none',
    label: 'designs.number-format.thousands-separator.none',
    character: '—',
  },
  {
    value: 'comma',
    label: 'designs.number-format.thousands-separator.comma',
    character: ',',
  },
  {
    value: 'period',
    label: 'designs.number-format.thousands-separator.period',
    character: '.',
  },
  {
    value: 'space',
    label: 'designs.number-format.thousands-separator.space',
    character: '␣',
  },
];

// The sign display options
const SignDisplayOptions: { value: SignDisplay; label: TranslationKey }[] = [
  { value: 'auto', label: 'designs.number-format.sign-display.auto' },
  { value: 'always', label: 'designs.number-format.sign-display.always' },
  { value: 'never', label: 'designs.number-format.sign-display.never' },
];

export interface NumberFormatFieldsProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the format controls of a number element: its decimal
 * places, thousands separator, sign display, and the text shown
 * either side of the value.
 */
export const NumberFormatFields: React.FC<NumberFormatFieldsProps> = ({
  elementId,
}) => {
  const studio = useDesignStudio();
  // Defaults match formatNumber's own defaults, so the panel shows
  // what the canvas renders
  const { decimals, thousandsSeparator, prefix, suffix, signDisplay } =
    useElementData(elementId, (element: FlatNumberPropertyElement) => ({
      decimals: element.format?.decimals ?? 0,
      thousandsSeparator: element.format?.thousandsSeparator ?? 'none',
      prefix: element.format?.prefix ?? '',
      suffix: element.format?.suffix ?? '',
      signDisplay: element.format?.signDisplay ?? 'auto',
    }));

  // The store deep merges nested objects, so writing one format
  // field leaves the rest of the format intact
  const updateFormat = useCallback(
    (format: Partial<NumberPropertyElement['format']>) => {
      studio.updateDesignElement<NumberPropertyElement>(elementId, { format });
    },
    [studio, elementId],
  );

  const handleDecimalsChange = useCallback(
    (value: number | null) => {
      updateFormat({ decimals: value ?? 0 });
    },
    [updateFormat],
  );

  const handleSeparatorChange = useCallback(
    (value: string) => {
      updateFormat({ thousandsSeparator: value as ThousandsSeparator });
    },
    [updateFormat],
  );

  const handleSignDisplayChange = useCallback(
    (value: string | number) => {
      updateFormat({ signDisplay: value as SignDisplay });
    },
    [updateFormat],
  );

  const handlePrefixChange = useCallback(
    (value: string) => {
      updateFormat({ prefix: value });
    },
    [updateFormat],
  );

  const handleSuffixChange = useCallback(
    (value: string) => {
      updateFormat({ suffix: value });
    },
    [updateFormat],
  );

  return (
    <PanelSection label="designs.number-format.label">
      <Stack gap={3}>
        {/** Thousands separator **/}
        <Stack gap={1}>
          <InputLabel
            size="xs"
            label="designs.number-format.thousands-separator.label"
          />
          <RadioToggleGroup
            size="md"
            value={thousandsSeparator}
            onValueChange={handleSeparatorChange}
          >
            {SeparatorOptions.map((option) => (
              <Toggle
                key={option.value}
                value={option.value}
                label={option.label}
              >
                <span className="designs-number-format-separator">
                  {option.character}
                </span>
              </Toggle>
            ))}
          </RadioToggleGroup>
        </Stack>

        {/** Decimal places and sign display **/}
        <Group gap={2}>
          <FlexItem grow={1} className="designs-number-format-field">
            <Stack gap={1}>
              <InputLabel
                size="xs"
                label="designs.number-format.decimals.label"
              />
              <NumberField
                variant="subtle"
                size="md"
                value={decimals || null}
                onValueChange={handleDecimalsChange}
                min={1}
                max={10}
                step={1}
                clearable
                placeholder="designs.number-format.decimals.placeholder"
              />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} className="designs-number-format-field">
            <SelectField
              variant="subtle"
              size="md"
              label="designs.number-format.sign-display.label"
              labelSize="xs"
              value={signDisplay}
              onValueChange={handleSignDisplayChange}
              options={SignDisplayOptions}
            >
              {SignDisplayOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </SelectField>
          </FlexItem>
        </Group>

        {/** Prefix and suffix **/}
        <Group gap={2}>
          <FlexItem grow={1} className="designs-number-format-field">
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.number-format.prefix" />
              <TextField
                variant="subtle"
                size="md"
                value={prefix}
                onValueChange={handlePrefixChange}
              />
            </Stack>
          </FlexItem>
          <FlexItem grow={1} className="designs-number-format-field">
            <Stack gap={1}>
              <InputLabel size="xs" label="designs.number-format.suffix" />
              <TextField
                variant="subtle"
                size="md"
                value={suffix}
                onValueChange={handleSuffixChange}
              />
            </Stack>
          </FlexItem>
        </Group>
      </Stack>
    </PanelSection>
  );
};
