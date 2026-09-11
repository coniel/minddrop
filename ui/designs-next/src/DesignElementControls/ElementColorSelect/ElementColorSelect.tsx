import { ElementColor } from '@minddrop/designs-next';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import {
  ContentColorSwatch,
  InputLabel,
  RadioToggleGroup,
  Stack,
  Toggle,
} from '@minddrop/ui-primitives';
import { ColorLevels, ContentColor, ContentColors } from '@minddrop/ui-theme';

export interface ElementColorSelectProps {
  /**
   * The colour the element is drawn in.
   */
  value: ElementColor;

  /**
   * Callback fired with the chosen colour.
   */
  onValueChange: (color: ElementColor) => void;
}

// The swatches a row holds, wrapping the rest onto a second
const OptionColumns = 6;

// The names of the content colours
const colorKey = createI18nKeyBuilder('color.');

/**
 * The swatch grid. Laid out inline so the column count wins over
 * the group's own single row.
 */
const OptionsLayout: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${OptionColumns}, auto)`,
};

/**
 * Renders the colour picker the element controls share. The content
 * colours sit above the steps of the chosen colour's ramp. Each
 * swatch is drawn in the colour it sets.
 *
 * Controls wrap it in a trigger of their own, so every colour an
 * element carries is picked the same way.
 */
export const ElementColorSelect: React.FC<ElementColorSelectProps> = ({
  value,
  onValueChange,
}) => {
  const { t } = useTranslation();

  // Draws the element in the chosen hue, holding its step
  function handleColorChange(color: ContentColor) {
    onValueChange({ ...value, color });
  }

  // Draws the element at the chosen step of its hue's ramp
  function handleLevelChange(chosenLevel: string) {
    // Match the radio value back to the step it stands for
    const level = ColorLevels.find((step) => String(step) === chosenLevel);

    if (level) {
      onValueChange({ ...value, level });
    }
  }

  return (
    <Stack gap={3}>
      <Stack gap={1}>
        <InputLabel size="xs" label="designsNext.settings.color.hue" />
        <RadioToggleGroup<ContentColor>
          size="sm"
          value={value.color}
          style={OptionsLayout}
          onValueChange={handleColorChange}
        >
          {ContentColors.map((color, index) => (
            <Toggle
              key={color}
              square
              size="sm"
              value={color}
              label={t(colorKey(color))}
              tooltip={{
                title: colorKey(color),
                side: resolveTooltipSide(index),
              }}
            >
              {/* Each hue at the swatch's own step. Walking the
                  ramp is the group below's job. The default option
                  picks no hue, so it is struck through. */}
              <ContentColorSwatch color={color} unset={color === 'default'} />
            </Toggle>
          ))}
        </RadioToggleGroup>
      </Stack>

      <Stack gap={1}>
        <InputLabel size="xs" label="designsNext.settings.color.shade" />
        <RadioToggleGroup
          size="sm"
          value={String(value.level)}
          style={OptionsLayout}
          onValueChange={handleLevelChange}
        >
          {ColorLevels.map((level, index) => (
            <Toggle
              key={level}
              square
              size="sm"
              value={String(level)}
              label={t('designsNext.settings.color.shadeLevel', { level })}
              tooltip={{
                // The step alone, the group it is in naming it
                stringTitle: String(level),
                side: resolveTooltipSide(index),
              }}
            >
              <ContentColorSwatch color={value.color} level={level} />
            </Toggle>
          ))}
        </RadioToggleGroup>
      </Stack>
    </Stack>
  );
};

/**
 * Resolves the side a swatch's tooltip opens on, clear of the
 * swatches around it. Above the top row, below the second.
 *
 * @param index - The swatch's place in its group.
 * @returns The side the tooltip opens on.
 */
function resolveTooltipSide(index: number): 'top' | 'bottom' {
  return index < OptionColumns ? 'top' : 'bottom';
}
