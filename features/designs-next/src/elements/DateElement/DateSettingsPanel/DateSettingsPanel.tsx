import { DesignElementSettingControlProps } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  InputLabel,
  RadioToggleGroup,
  SelectField,
  Stack,
  SwitchField,
  Toggle,
} from '@minddrop/ui-primitives';
import { DateMode, DateStyle, formatDate } from '@minddrop/utils';
import { DateElement } from '../DateElement.types';
import {
  DateModes,
  DateStyles,
  DefaultDateMode,
  DefaultDateShowTime,
  DefaultDateStyle,
} from '../constants';

// The name of each mode
const DateModeLabels: Record<DateMode, TranslationKey> = {
  date: 'designsNext.elements.date.mode.date',
  relative: 'designsNext.elements.date.mode.relative',
};

// The date each style option shows as its sample
const SampleDate = new Date(2026, 2, 5);

// The style options, named by the sample date in their style
const DateStyleSelectOptions = DateStyles.map((style) => ({
  value: style,
  stringLabel: formatDate(SampleDate, { style }),
}));

/**
 * Renders a date element's settings.
 */
export const DateSettingsPanel: React.FC<
  DesignElementSettingControlProps<DateElement>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // Resolve the element's format, a medium date without the time by
  // default.
  const mode = element.mode ?? DefaultDateMode;
  const dateStyle = element.dateStyle ?? DefaultDateStyle;
  const showTime = element.showTime ?? DefaultDateShowTime;

  // Applies the chosen mode
  function handleModeChange(mode: DateMode) {
    onChange({ mode });
  }

  // Applies the chosen style
  function handleStyleChange(dateStyle: DateStyle) {
    onChange({ dateStyle });
  }

  // Applies whether the time follows the date
  function handleShowTimeChange(showTime: boolean) {
    onChange({ showTime });
  }

  return (
    <Stack gap={3}>
      {/** Mode **/}
      <Stack gap={1}>
        <InputLabel size="xs" label="designsNext.elements.date.mode.label" />
        <RadioToggleGroup<DateMode>
          size="sm"
          value={mode}
          onValueChange={handleModeChange}
        >
          {DateModes.map((option) => (
            <Toggle
              key={option}
              size="sm"
              value={option}
              label={t(DateModeLabels[option])}
            />
          ))}
        </RadioToggleGroup>
      </Stack>
      {/** Style and time of a date read as itself **/}
      {mode === 'date' && (
        <>
          <SelectField
            variant="subtle"
            size="sm"
            label="designsNext.elements.date.style"
            labelSize="xs"
            value={dateStyle}
            options={DateStyleSelectOptions}
            onValueChange={handleStyleChange}
          />
          <SwitchField
            size="sm"
            label="designsNext.elements.date.showTime"
            labelSize="xs"
            checked={showTime}
            onCheckedChange={handleShowTimeChange}
          />
        </>
      )}
    </Stack>
  );
};
