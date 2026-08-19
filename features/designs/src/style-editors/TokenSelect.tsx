import { useMemo } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { SelectField, SelectOption } from '@minddrop/ui-primitives';

// Value used by the "default" option, since a select cannot carry
// undefined as an option value
export const UnsetValue = '__unset__';

export interface TokenSelectProps<TToken extends string> {
  /**
   * The field label. Omitted for selects grouped into a cluster,
   * where the value itself reads as the label.
   */
  label?: TranslationKey;

  /**
   * The tokens offered as options, in scale order.
   */
  tokens: readonly TToken[];

  /**
   * The currently selected token, or undefined when the style key
   * is not set.
   */
  value: TToken | undefined;

  /**
   * Builds the i18n key of an option's label and helper text.
   * Called as `optionKey(token, 'label')` and
   * `optionKey(token, 'description')`. Scales whose options speak
   * for themselves return no description key.
   */
  optionKey: {
    (token: TToken, part: 'label'): TranslationKey;
    (token: TToken, part: 'description'): TranslationKey | undefined;
  };

  /**
   * The i18n keys of the option which clears the value, for fields
   * where an unset value reads as something other than inherited.
   */
  clearOption?: {
    label: TranslationKey;
    description: TranslationKey;
  };

  /**
   * The token an unset value reads as, for scales where the
   * theme's default lands on a known step. Drops the "default"
   * option: choosing that step clears the key instead.
   */
  defaultToken?: TToken;

  /**
   * Called with the chosen token, or undefined when the user
   * clears the value.
   */
  onChange: (value: TToken | undefined) => void;
}

/**
 * Renders a select over a token scale. Options carry helper text
 * explaining what the step is for, unless the scale reads plainly
 * enough to go without. The list always opens with a "default"
 * option which clears the style key so the theme's standard value
 * applies rather than an emitted one.
 */
export function TokenSelect<TToken extends string>({
  label,
  tokens,
  value,
  optionKey,
  clearOption,
  defaultToken,
  onChange,
}: TokenSelectProps<TToken>) {
  // Build the option list once per token scale, leading with the
  // option which clears the value
  const options = useMemo<SelectOption<string>[]>(() => {
    const tokenOptions = tokens.map((token) => ({
      value: token,
      label: optionKey(token, 'label'),
      description: optionKey(token, 'description'),
    }));

    // A scale with a built-in default needs no clearing option:
    // the default itself plays that part
    if (defaultToken) {
      return tokenOptions;
    }

    // Describing the clearing option alone would leave one tall row
    // among plain ones, so it follows the scale
    const describes = tokenOptions.some((option) => option.description);

    return [
      {
        value: UnsetValue,
        label: clearOption?.label ?? 'designsStudio.style.default.label',
        description: describes
          ? (clearOption?.description ??
            'designsStudio.style.default.description')
          : undefined,
      },
      ...tokenOptions,
    ];
  }, [tokens, optionKey, clearOption, defaultToken]);

  // Clear the style key when the "default" option or the default
  // step is chosen, so the key is deleted rather than stored
  function handleValueChange(selected: string | number) {
    if (selected === UnsetValue || selected === defaultToken) {
      onChange(undefined);

      return;
    }

    onChange(selected as TToken);
  }

  return (
    <SelectField
      size="sm"
      variant="subtle"
      label={label}
      labelSize="xs"
      options={options}
      value={value ?? defaultToken ?? UnsetValue}
      onValueChange={handleValueChange}
    />
  );
}
