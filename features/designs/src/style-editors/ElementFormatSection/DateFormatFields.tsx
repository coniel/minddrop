import { useCallback, useMemo } from 'react';
import { DateMode, DatePropertyElement, DateStyle } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import {
  RadioToggleGroup,
  Select,
  SelectItem,
  Stack,
  SwitchField,
  Toggle,
} from '@minddrop/ui-primitives';
import { useDesignStudio, useElementData } from '../../DesignStudioStore';
import { FlatDatePropertyElement } from '../../types';
import { PanelSection } from '../PanelSection';

// A fixed sample date the style preset options are formatted with,
// so each option reads as the output it produces
const SampleDate = new Date('2026-03-05T14:30:00Z');

// The date style presets, with the Intl options each one stands
// for. The preset labels are the sample date rendered through
// them, which explains the presets better than names would.
const DateStylePresets: {
  value: DateStyle;
  options: Intl.DateTimeFormatOptions;
}[] = [
  {
    value: 'compact',
    options: { day: 'numeric', month: 'numeric', year: '2-digit' },
  },
  {
    value: 'short',
    options: { day: '2-digit', month: '2-digit', year: 'numeric' },
  },
  {
    value: 'medium',
    options: { day: 'numeric', month: 'short', year: 'numeric' },
  },
  {
    value: 'long',
    options: { day: 'numeric', month: 'long', year: 'numeric' },
  },
  {
    value: 'full',
    options: {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  },
];

export interface DateFormatFieldsProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders the format controls of a date element: whether it reads
 * as an absolute or relative date, which style preset an absolute
 * date takes, and whether it includes the time.
 */
export const DateFormatFields: React.FC<DateFormatFieldsProps> = ({
  elementId,
}) => {
  const { t } = useTranslation();
  const studio = useDesignStudio();
  // Defaults match formatDesignDate's own defaults, so the panel
  // shows what the canvas renders
  const { mode, dateStyle, showTime } = useElementData(
    elementId,
    (element: FlatDatePropertyElement) => ({
      mode: element.format?.mode ?? 'date',
      dateStyle: element.format?.dateStyle ?? 'medium',
      showTime: element.format?.showTime ?? false,
    }),
  );

  // Format each preset's label in the user's locale
  const styleOptions = useMemo(() => {
    return DateStylePresets.map((preset) => ({
      value: preset.value,
      label: new Intl.DateTimeFormat(undefined, preset.options).format(
        SampleDate,
      ),
    }));
  }, []);

  // A relative date describes an interval, so neither the style
  // preset nor the time apply to it
  const isRelative = mode === 'relative';

  const handleModeChange = useCallback(
    (value: string) => {
      studio.updateDesignElement<DatePropertyElement>(elementId, {
        format: { mode: value as DateMode },
      });
    },
    [studio, elementId],
  );

  const handleDateStyleChange = useCallback(
    (value: string) => {
      studio.updateDesignElement<DatePropertyElement>(elementId, {
        format: { dateStyle: value as DateStyle },
      });
    },
    [studio, elementId],
  );

  const handleShowTimeChange = useCallback(
    (checked: boolean) => {
      studio.updateDesignElement<DatePropertyElement>(elementId, {
        format: { showTime: checked },
      });
    },
    [studio, elementId],
  );

  return (
    <PanelSection label="designs.date-format.label">
      <Stack gap={3}>
        <RadioToggleGroup
          size="md"
          value={mode}
          onValueChange={handleModeChange}
        >
          <Toggle value="date" label={t('designs.date-format.mode.date')} />
          <Toggle
            value="relative"
            label={t('designs.date-format.mode.relative')}
          />
        </RadioToggleGroup>

        <Select
          variant="subtle"
          value={dateStyle}
          onValueChange={handleDateStyleChange}
          disabled={isRelative}
        >
          {styleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <SwitchField
          size="md"
          label="designs.date-format.show-time"
          checked={showTime}
          disabled={isRelative}
          onCheckedChange={handleShowTimeChange}
        />
      </Stack>
    </PanelSection>
  );
};
