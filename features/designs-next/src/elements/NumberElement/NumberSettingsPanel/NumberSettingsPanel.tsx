import { DesignElementSettingControlProps } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  FlexItem,
  Group,
  InputLabel,
  RadioToggleGroup,
  SelectField,
  SelectOption,
  Stack,
  SwitchField,
  TextField,
  Toggle,
} from '@minddrop/ui-primitives';
import {
  NumberSeparator,
  NumberSignDisplay,
  formatNumber,
} from '@minddrop/utils';
import { NumberElement } from '../NumberElement.types';
import {
  DefaultNumberNotation,
  DefaultNumberSeparator,
  DefaultNumberSignDisplay,
  NumberDecimalPlaces,
  NumberSeparators,
  NumberSignDisplays,
} from '../constants';

// The name of each separator
const SeparatorLabels: Record<NumberSeparator, TranslationKey> = {
  none: 'designsNext.elements.number.separator.none',
  comma: 'designsNext.elements.number.separator.comma',
  period: 'designsNext.elements.number.separator.period',
  space: 'designsNext.elements.number.separator.space',
};

// The name of each sign display
const SignDisplayLabels: Record<NumberSignDisplay, TranslationKey> = {
  auto: 'designsNext.elements.number.signDisplay.auto',
  always: 'designsNext.elements.number.signDisplay.always',
  never: 'designsNext.elements.number.signDisplay.never',
};

// The sign display options in display order
const SignDisplayOptions: SelectOption<NumberSignDisplay>[] =
  NumberSignDisplays.map((signDisplay) => ({
    value: signDisplay,
    label: SignDisplayLabels[signDisplay],
  }));

// The number each separator option shows as its sample
const SeparatorSample = 1000;

// The decimal places option writing the number as it is
const AsIsDecimals = 'as-is';

// The decimal places options: as is, then each count
const DecimalsOptions: SelectOption<number | typeof AsIsDecimals>[] = [
  { value: AsIsDecimals, label: 'designsNext.elements.number.decimalsAsIs' },
  ...NumberDecimalPlaces.map((places) => ({
    value: places,
    stringLabel: String(places),
  })),
];

/**
 * Renders a number element's settings.
 */
export const NumberSettingsPanel: React.FC<
  DesignElementSettingControlProps<NumberElement>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // Resolve the element's format, none of it set by default
  const decimals = element.decimals ?? AsIsDecimals;
  const separator = element.separator ?? DefaultNumberSeparator;
  const signDisplay = element.signDisplay ?? DefaultNumberSignDisplay;
  const notation = element.notation ?? DefaultNumberNotation;

  // Applies the chosen decimal places, clearing them for as is
  function handleDecimalsChange(decimals: number | typeof AsIsDecimals) {
    onChange({ decimals: decimals === AsIsDecimals ? undefined : decimals });
  }

  // Applies the chosen separator
  function handleSeparatorChange(separator: NumberSeparator) {
    onChange({ separator });
  }

  // Applies the chosen sign display
  function handleSignDisplayChange(signDisplay: NumberSignDisplay) {
    onChange({ signDisplay });
  }

  // Applies whether the number is written compact, clearing the
  // notation back to standard when it is not.
  function handleCompactChange(compact: boolean) {
    onChange({ notation: compact ? 'compact' : undefined });
  }

  // Applies the typed prefix, clearing it when the field is emptied
  function handlePrefixChange(prefix: string) {
    onChange({ prefix: prefix || undefined });
  }

  // Applies the typed suffix, clearing it when the field is emptied
  function handleSuffixChange(suffix: string) {
    onChange({ suffix: suffix || undefined });
  }

  return (
    <Stack gap={3}>
      {/** Sign display and decimal places **/}
      <Group gap={2}>
        <FlexItem grow={1}>
          <SelectField<NumberSignDisplay>
            variant="subtle"
            size="sm"
            label="designsNext.elements.number.signDisplay.label"
            labelSize="xs"
            value={signDisplay}
            options={SignDisplayOptions}
            onValueChange={handleSignDisplayChange}
          />
        </FlexItem>
        <FlexItem grow={1}>
          <SelectField<number | typeof AsIsDecimals>
            variant="subtle"
            size="sm"
            label="designsNext.elements.number.decimals"
            labelSize="xs"
            value={decimals}
            options={DecimalsOptions}
            onValueChange={handleDecimalsChange}
          />
        </FlexItem>
      </Group>
      {/** Separator **/}
      <Stack gap={1}>
        <InputLabel
          size="xs"
          label="designsNext.elements.number.separator.label"
        />
        <RadioToggleGroup<NumberSeparator>
          size="sm"
          value={separator}
          onValueChange={handleSeparatorChange}
        >
          {NumberSeparators.map((option) => (
            <Toggle
              key={option}
              size="sm"
              value={option}
              label={t(SeparatorLabels[option])}
              tooltip={{ title: SeparatorLabels[option] }}
            >
              {formatNumber(SeparatorSample, { separator: option })}
            </Toggle>
          ))}
        </RadioToggleGroup>
      </Stack>
      {/** Compact notation **/}
      <SwitchField
        size="sm"
        label="designsNext.elements.number.compact"
        labelSize="xs"
        checked={notation === 'compact'}
        onCheckedChange={handleCompactChange}
      />
      {/** Prefix and suffix **/}
      <Group gap={2}>
        <FlexItem grow={1}>
          <TextField
            variant="subtle"
            size="sm"
            label="designsNext.elements.number.prefix"
            labelSize="xs"
            value={element.prefix ?? ''}
            onValueChange={handlePrefixChange}
          />
        </FlexItem>
        <FlexItem grow={1}>
          <TextField
            variant="subtle"
            size="sm"
            label="designsNext.elements.number.suffix"
            labelSize="xs"
            value={element.suffix ?? ''}
            onValueChange={handleSuffixChange}
          />
        </FlexItem>
      </Group>
    </Stack>
  );
};
