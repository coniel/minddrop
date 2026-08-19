import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  InputLabel,
  RadioToggleGroup,
  Stack,
  Toggle,
} from '@minddrop/ui-primitives';
import './OptionToggleField.css';

export interface OptionToggleFieldOption<TValue extends string> {
  /**
   * The style value the option sets.
   */
  value: TValue;

  /**
   * The i18n key of the option's label.
   */
  label: TranslationKey;

  /**
   * The icon shown in place of the label, which becomes the
   * option's accessible name.
   */
  icon?: UiIconName;

  /**
   * The i18n key of a short sample shown in place of the label
   * (e.g. letter pairs for capitalisation options), which becomes
   * the option's accessible name.
   */
  display?: TranslationKey;

  /**
   * The i18n key of the tooltip explaining what the option does.
   */
  description?: TranslationKey;
}

export interface OptionToggleFieldProps<TValue extends string> {
  /**
   * The field label. Omitted on fields whose options speak for
   * themselves.
   */
  label?: TranslationKey;

  /**
   * The options offered, in display order.
   */
  options: OptionToggleFieldOption<TValue>[];

  /**
   * The currently selected value, or undefined when the style key
   * is not set.
   */
  value: TValue | undefined;

  /**
   * Called with the chosen value.
   */
  onChange: (value: TValue) => void;
}

/**
 * Renders a small set of mutually exclusive style options as a
 * radio toggle group. A selection is always active: fields whose
 * value can be unset offer an explicit none option instead of
 * deselection.
 */
export function OptionToggleField<TValue extends string>({
  label,
  options,
  value,
  onChange,
}: OptionToggleFieldProps<TValue>) {
  const { t } = useTranslation();

  // Glyph options (icons and short samples) carry their whole
  // meaning in the glyph, which needs more room than a word does
  // to stay legible
  const hasGlyphs = options.some((option) => option.icon || option.display);

  function handleValueChange(selected: string) {
    onChange(selected as TValue);
  }

  return (
    <Stack gap={1}>
      {label && <InputLabel size="xs" label={label} />}
      <RadioToggleGroup
        size={hasGlyphs ? 'md' : 'sm'}
        className={hasGlyphs ? 'designs-option-toggle-field-icons' : undefined}
        value={value ?? ''}
        onValueChange={handleValueChange}
      >
        {options.map((option) => (
          <Toggle
            key={option.value}
            value={option.value}
            icon={option.icon}
            label={t(option.label)}
            tooltip={
              option.description
                ? { title: option.label, description: option.description }
                : undefined
            }
          >
            {option.display ? t(option.display) : null}
          </Toggle>
        ))}
      </RadioToggleGroup>
    </Stack>
  );
}
