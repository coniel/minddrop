import { useCallback } from 'react';
import { DateElement, DefaultTextElementStyle } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import {
  RadioToggleGroup,
  Select,
  SelectItem,
  Stack,
  SwitchField,
  Toggle,
} from '@minddrop/ui-primitives';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { Typography } from '../../style-editors/Typography';
import { FlatDateElement } from '../../types';
import { DatePlaceholderField } from './DatePlaceholderField';

export interface DateElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

// Default values for the typography collapsible section
const typographyDefaults = {
  'font-family': DefaultTextElementStyle['font-family'],
  'font-weight': DefaultTextElementStyle['font-weight'],
  color: DefaultTextElementStyle.color,
  opacity: DefaultTextElementStyle.opacity,
} as const;

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultTextElementStyle['margin-top'],
  'margin-right': DefaultTextElementStyle['margin-right'],
  'margin-bottom': DefaultTextElementStyle['margin-bottom'],
  'margin-left': DefaultTextElementStyle['margin-left'],
} as const;

// Date style preset options with locale-formatted example labels.
// Uses a fixed sample date (5 Mar 2026) for preview.
const sampleDate = new Date('2026-03-05T14:30:00Z');

const dateStylePresets = [
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
] as const;

// Pre-format the labels using the user's locale
const dateStyleOptions = dateStylePresets.map((preset) => ({
  value: preset.value,
  label: new Intl.DateTimeFormat(
    undefined,
    preset.options as Intl.DateTimeFormatOptions,
  ).format(sampleDate),
}));

/**
 * Renders the style editor panel for date design elements.
 * Provides placeholder, date format (mode toggle, style preset
 * select, time switch), typography, alignment, and margin controls.
 */
export const DateElementStyleEditor: React.FC<DateElementStyleEditorProps> = ({
  elementId,
}) => {
  const { t } = useTranslation();

  // Read format values from the store
  const { mode, dateStyle, showTime } = useElementData(
    elementId,
    (element: FlatDateElement) => ({
      mode: element.format?.mode ?? 'date',
      dateStyle: element.format?.dateStyle ?? 'medium',
      showTime: element.format?.showTime ?? false,
    }),
  );

  // Whether controls should be disabled (relative mode)
  const isRelative = mode === 'relative';

  // Resolve the stored dateStyle to its formatted label
  const selectedLabel =
    dateStyleOptions.find((option) => option.value === dateStyle)?.label ??
    dateStyleOptions[2].label;

  // Update a format property on the element
  const handleDateStyleChange = useCallback(
    (selected: string) => {
      // Match the selected label back to a preset value
      const match = dateStyleOptions.find(
        (option) => option.label === selected,
      );

      if (match) {
        updateDesignElement<DateElement>(elementId, {
          format: { dateStyle: match.value },
        });
      }
    },
    [elementId],
  );

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.placeholder.label" />
        <DatePlaceholderField elementId={elementId} />
      </Stack>

      <Stack gap={3}>
        <SectionLabel label="designs.date-format.label" />

        <RadioToggleGroup
          size="md"
          value={mode}
          onValueChange={(value) =>
            updateDesignElement<DateElement>(elementId, {
              format: { mode: value },
            })
          }
        >
          <Toggle value="date" label={t('designs.date-format.mode.date')} />
          <Toggle
            value="relative"
            label={t('designs.date-format.mode.relative')}
          />
        </RadioToggleGroup>

        <Select
          variant="subtle"
          value={selectedLabel}
          onValueChange={handleDateStyleChange}
          disabled={isRelative}
        >
          {dateStyleOptions.map((option) => (
            <SelectItem key={option.value} value={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <SwitchField
          size="md"
          label="designs.date-format.show-time"
          checked={showTime}
          disabled={isRelative}
          onCheckedChange={(checked) =>
            updateDesignElement<DateElement>(elementId, {
              format: { showTime: checked },
            })
          }
        />
      </Stack>

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.label"
        defaultStyles={typographyDefaults}
      >
        <Typography
          elementId={elementId}
          hideLineHeight
          hideTextAlign
          hideMaxWidth
        />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.margin.label"
        defaultStyles={marginDefaults}
      >
        <MarginFields elementId={elementId} />
      </CollapsibleSection>
    </>
  );
};
