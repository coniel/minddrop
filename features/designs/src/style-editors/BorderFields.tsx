import { useState } from 'react';
import {
  BorderColor,
  BorderColors,
  BorderEmphases,
  BorderEmphasis,
  BorderLineStyle,
  BorderWidthToken,
  BorderWidthTokens,
  RadiusToken,
  RadiusTokens,
} from '@minddrop/designs';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import {
  InputLabel,
  RadioToggleGroup,
  SelectOption,
  Stack,
  Toggle,
} from '@minddrop/ui-primitives';
import {
  OptionToggleField,
  OptionToggleFieldOption,
} from './OptionToggleField';
import { CrossSide, SideSelectCross } from './SideSelectCross';
import { TokenSelect } from './TokenSelect';
import {
  borderStyleOptionKey,
  fieldLabelKey,
  radiusOptionKey,
} from './styleI18nKeys';
import { StyleEditor } from './useStyleEditor';

const borderWidthKey = createI18nKeyBuilder('designsStudio.style.borderWidth.');

const borderColourKey = createI18nKeyBuilder(
  'designsStudio.style.borderColour.',
);

const borderEmphasisKey = createI18nKeyBuilder(
  'designsStudio.style.borderEmphasis.',
);

/**
 * The colour treatments a border can take: pinned neutral, or the
 * colour scheme's accent.
 */
export const BorderColorOptions: OptionToggleFieldOption<BorderColor>[] =
  BorderColors.map((color) => ({
    value: color,
    label: borderColourKey(color, 'label'),
    description: borderColourKey(color, 'description'),
  }));

/**
 * How strongly the border colour applies.
 */
export const BorderEmphasisOptions: OptionToggleFieldOption<BorderEmphasis>[] =
  BorderEmphases.map((emphasis) => ({
    value: emphasis,
    label: borderEmphasisKey(emphasis, 'label'),
    description: borderEmphasisKey(emphasis, 'description'),
  }));

// The border line styles, which are a fixed vocabulary rather
// than a theme scale
const BorderLineStyles: readonly BorderLineStyle[] = [
  'solid',
  'dashed',
  'dotted',
];

// The per-side width keys in cross order, clockwise from the top
const SideWidthKeys = [
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
] as const;

type SideWidthKey = (typeof SideWidthKeys)[number];

// The width key behind each cross side
const SideKeysByCross: Record<CrossSide, SideWidthKey> = {
  top: 'borderTopWidth',
  right: 'borderRightWidth',
  bottom: 'borderBottomWidth',
  left: 'borderLeftWidth',
};

// Value used by the option which stops a side drawing, since a
// select cannot carry undefined as an option value
const NoneValue = 'none';

/**
 * The style keys the border block writes to.
 */
export const BorderStyleKeys: string[] = [
  'borderStyle',
  'borderColor',
  'borderEmphasis',
  ...SideWidthKeys,
  'borderRadius',
];

// Shared attributes of the line style glyphs
const svgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
};

// The glyph drawn inside each line style toggle
const LineStyleIcons: Record<BorderLineStyle, React.ReactNode> = {
  solid: (
    <svg {...svgProps} strokeWidth={2}>
      <line x1="2" y1="8" x2="14" y2="8" />
    </svg>
  ),
  dashed: (
    <svg {...svgProps} strokeWidth={2}>
      <line x1="2" y1="8" x2="14" y2="8" strokeDasharray="4 3" />
    </svg>
  ),
  dotted: (
    <svg {...svgProps} strokeWidth={2}>
      <line x1="2" y1="8" x2="14" y2="8" strokeDasharray="1.5 3" />
    </svg>
  ),
};

// The options each side select offers: the width scale plus the
// option which stops the side drawing
const WidthOptions: SelectOption<string>[] = [
  { value: NoneValue, label: borderWidthKey('none', 'label') },
  ...BorderWidthTokens.map((token) => ({
    value: token,
    label: borderWidthKey(token, 'label'),
  })),
];

export interface BorderFieldsProps {
  /**
   * The style editing helpers for the element being styled.
   */
  editor: StyleEditor;

  /**
   * Whether the corner radius field is offered. Defaults to true;
   * containers leave rounding to the rendering context's scheme.
   */
  radius?: boolean;
}

/**
 * Renders the shared border block: the line style toggle, the
 * colour and emphasis toggles, the per-side thickness selects
 * arranged in a compass cross with a sync toggle, and the corner
 * radius.
 */
export const BorderFields: React.FC<BorderFieldsProps> = ({
  editor,
  radius = true,
}) => {
  const { t } = useTranslation();
  const { isEditable, getValue, setValue } = editor;

  // The line style, whose presence is what draws the border
  const lineStyle = getValue<BorderLineStyle>('borderStyle');

  // The stored per-side widths, all absent when the border draws
  // uniformly thin
  const sideWidths = SideWidthKeys.map((key) =>
    getValue<BorderWidthToken>(key),
  );

  const hasSideWidths = sideWidths.some(Boolean);

  // Start the sides linked while the border draws evenly on all four
  const [synced, setSynced] = useState(() => {
    if (!lineStyle) {
      return false;
    }

    // No per-side widths is the uniform thin default
    if (!hasSideWidths) {
      return true;
    }

    return sideWidths.every((width) => width && width === sideWidths[0]);
  });

  // A role suppressing every border key leaves nothing to render,
  // which also lets the surrounding section hide itself
  if (!BorderStyleKeys.some(isEditable)) {
    return null;
  }

  // Restyle the border line
  function handleLineStyleChange(value: string) {
    setValue('borderStyle', value);
  }

  // The neutral default is stored as an unset key
  function handleColorChange(color: BorderColor) {
    setValue('borderColor', color === 'neutral' ? undefined : color);
  }

  // The regular default is stored as an unset key
  function handleEmphasisChange(emphasis: BorderEmphasis) {
    setValue('borderEmphasis', emphasis === 'regular' ? undefined : emphasis);
  }

  // Route a cross side's pick onto its width key
  function handleCrossSideChange(side: CrossSide, selected: string | number) {
    handleSideWidthChange(SideKeysByCross[side], selected);
  }

  // Apply a side's width pick, keeping the other sides on the
  // width they showed
  function handleSideWidthChange(key: SideWidthKey, selected: string | number) {
    // The none option stops the side drawing
    if (selected === NoneValue) {
      // Linked sides stop together
      if (synced) {
        clearBorder();

        return;
      }

      // The uniform default has no keys to remove one from, so it
      // materialises: the other sides keep their thin width
      if (!hasSideWidths) {
        SideWidthKeys.forEach((sideKey) => {
          setValue(sideKey, sideKey === key ? undefined : 'thin');
        });

        return;
      }

      // Removing the last drawing side removes the border
      const remaining = SideWidthKeys.filter(
        (sideKey) => sideKey !== key && getValue(sideKey),
      );

      if (remaining.length === 0) {
        clearBorder();

        return;
      }

      setValue(key, undefined);

      return;
    }

    const width = selected as BorderWidthToken;

    // Picking a width is how a border starts, defaulting to solid
    if (!lineStyle) {
      setValue('borderStyle', 'solid');
    }

    // Linked sides share the width; uniform thin is the default,
    // stored as unset keys
    if (synced) {
      SideWidthKeys.forEach((sideKey) => {
        setValue(sideKey, width === 'thin' ? undefined : width);
      });

      return;
    }

    // The uniform default materialises before an unlinked change,
    // so the other sides keep the thin width they showed. A border
    // started unlinked draws this side alone.
    if (!hasSideWidths && lineStyle) {
      SideWidthKeys.forEach((sideKey) => {
        setValue(sideKey, sideKey === key ? width : 'thin');
      });

      return;
    }

    setValue(key, width);
  }

  // Unset every border key except the radius, which rounds the
  // corners independently of the border itself
  function clearBorder() {
    setValue('borderStyle', undefined);
    setValue('borderColor', undefined);
    setValue('borderEmphasis', undefined);

    SideWidthKeys.forEach((sideKey) => {
      setValue(sideKey, undefined);
    });
  }

  // Link or unlink the sides, equalising them when linking
  function handleToggleSync() {
    if (synced) {
      setSynced(false);

      return;
    }

    // Linking equalises every side on the first drawn width, with
    // uniform thin collapsing back to unset keys
    if (lineStyle && hasSideWidths) {
      const width = sideWidths.find(Boolean) ?? 'thin';

      SideWidthKeys.forEach((sideKey) => {
        setValue(sideKey, width === 'thin' ? undefined : width);
      });
    }

    setSynced(true);
  }

  // Resolve the value a side's select shows: its own width, the
  // uniform thin default, or none while it does not draw
  function sideValue(key: SideWidthKey): string {
    // Without a line style nothing draws
    if (!lineStyle) {
      return NoneValue;
    }

    // No per-side widths is the uniform thin default
    if (!hasSideWidths) {
      return 'thin';
    }

    return getValue<BorderWidthToken>(key) ?? NoneValue;
  }

  return (
    <>
      {isEditable('borderStyle') && (
        <Stack gap={1}>
          <InputLabel size="xs" label={fieldLabelKey('borderStyle')} />
          <RadioToggleGroup
            size="md"
            value={lineStyle ?? ''}
            onValueChange={handleLineStyleChange}
          >
            {BorderLineStyles.map((style) => (
              <Toggle
                key={style}
                value={style}
                label={t(borderStyleOptionKey(style, 'label'))}
                tooltip={{
                  title: borderStyleOptionKey(style, 'label'),
                  description: borderStyleOptionKey(style, 'description'),
                }}
              >
                {LineStyleIcons[style]}
              </Toggle>
            ))}
          </RadioToggleGroup>
        </Stack>
      )}
      {isEditable('borderColor') && (
        <OptionToggleField
          label={fieldLabelKey('borderColour')}
          options={BorderColorOptions}
          value={getValue<BorderColor>('borderColor') ?? 'neutral'}
          onChange={handleColorChange}
        />
      )}
      {isEditable('borderEmphasis') && (
        <OptionToggleField
          label={fieldLabelKey('emphasis')}
          options={BorderEmphasisOptions}
          value={getValue<BorderEmphasis>('borderEmphasis') ?? 'regular'}
          onChange={handleEmphasisChange}
        />
      )}
      {SideWidthKeys.every((key) => isEditable(key)) && (
        <Stack gap={1}>
          <InputLabel size="xs" label={fieldLabelKey('borderWidth')} />
          <SideSelectCross
            options={WidthOptions}
            values={{
              top: sideValue('borderTopWidth'),
              right: sideValue('borderRightWidth'),
              bottom: sideValue('borderBottomWidth'),
              left: sideValue('borderLeftWidth'),
            }}
            synced={synced}
            syncLabel={borderWidthKey('sync')}
            onSideChange={handleCrossSideChange}
            onToggleSync={handleToggleSync}
          />
        </Stack>
      )}
      {radius && isEditable('borderRadius') && (
        <TokenSelect
          label={fieldLabelKey('radius')}
          tokens={RadiusTokens}
          value={getValue<RadiusToken>('borderRadius')}
          optionKey={radiusOptionKey}
          onChange={(value) => setValue('borderRadius', value)}
        />
      )}
    </>
  );
};
