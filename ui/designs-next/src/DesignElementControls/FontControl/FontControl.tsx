import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  Designs,
  FontFamily,
  TextSettings,
} from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  Group,
  InputLabel,
  RadioToggleGroup,
  Stack,
  Toggle,
  ToolbarHoverPanel,
} from '@minddrop/ui-primitives';
import './FontControl.css';

/**
 * The settings the font control sets: the family the text is set
 * in and the styles laid over it.
 */
export type FontSettings = Pick<
  TextSettings,
  'fontFamily' | 'italic' | 'underline' | 'strikethrough'
>;

// The name of each family
const FontFamilyLabels: Record<FontFamily, TranslationKey> = {
  sans: 'designsNext.settings.fontFamily.sans',
  serif: 'designsNext.settings.fontFamily.serif',
  mono: 'designsNext.settings.fontFamily.mono',
};

/**
 * Renders the picker for the font text is set in, opened out of
 * the toolbar: the family options and the italic, underline and
 * strikethrough toggles.
 */
export const FontControl: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  const { t } = useTranslation();

  // The family the text is set in, the content sans by default
  const fontFamily = element.fontFamily ?? 'sans';
  const italic = Boolean(element.italic);
  const underline = Boolean(element.underline);
  const strikethrough = Boolean(element.strikethrough);

  // Sets the family the text is set in
  function handleFontFamilyChange(chosenFamily: FontFamily) {
    onChange({ fontFamily: chosenFamily });
  }

  return (
    <ToolbarHoverPanel
      label={t('designsNext.settings.fontFamily.label')}
      trigger={
        <span className={`design-font-control-sample-${fontFamily}`}>Ag</span>
      }
      padded
    >
      <Stack gap={3}>
        <Stack gap={1}>
          <InputLabel size="xs" label="designsNext.settings.fontFamily.label" />
          <RadioToggleGroup<FontFamily>
            size="sm"
            value={fontFamily}
            onValueChange={handleFontFamilyChange}
          >
            {Designs.constants.FontFamilies.map((family) => (
              <Toggle
                key={family}
                size="sm"
                value={family}
                label={t(FontFamilyLabels[family])}
              >
                <span className={`design-font-control-sample-${family}`}>
                  {t(FontFamilyLabels[family])}
                </span>
              </Toggle>
            ))}
          </RadioToggleGroup>
        </Stack>
        <Stack gap={1}>
          <InputLabel size="xs" label="designsNext.settings.textStyle" />
          <Group gap={1}>
            <Toggle
              size="sm"
              icon="italic"
              label={t('designsNext.settings.italic')}
              pressed={italic}
              onPressedChange={(pressed) => onChange({ italic: pressed })}
              tooltip={{ title: 'designsNext.settings.italic' }}
            />
            <Toggle
              size="sm"
              icon="underline"
              label={t('designsNext.settings.underline')}
              pressed={underline}
              onPressedChange={(pressed) => onChange({ underline: pressed })}
              tooltip={{ title: 'designsNext.settings.underline' }}
            />
            <Toggle
              size="sm"
              icon="strikethrough"
              label={t('designsNext.settings.strikethrough')}
              pressed={strikethrough}
              onPressedChange={(pressed) =>
                onChange({ strikethrough: pressed })
              }
              tooltip={{ title: 'designsNext.settings.strikethrough' }}
            />
          </Group>
        </Stack>
      </Stack>
    </ToolbarHoverPanel>
  );
};
