import { TranslationKey } from '@minddrop/i18n';
import { SwitchField } from '@minddrop/ui-primitives';

export interface BooleanToggleFieldProps {
  /**
   * The field label.
   */
  label: TranslationKey;

  /**
   * Whether the style is switched on. Treated as off when the
   * style key is not set.
   */
  value: boolean | undefined;

  /**
   * Called with true when switched on, and undefined when switched
   * off so the key is cleared rather than stored as false.
   */
  onChange: (value: true | undefined) => void;
}

/**
 * Renders an on/off style option. Switching off clears the style
 * key, since an unset key and an explicit false emit the same CSS.
 */
export const BooleanToggleField: React.FC<BooleanToggleFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  // Clear the key when switching off so styles stay free of
  // values which emit nothing
  function handleCheckedChange(checked: boolean) {
    onChange(checked ? true : undefined);
  }

  return (
    <SwitchField
      size="md"
      label={label}
      checked={value ?? false}
      onCheckedChange={handleCheckedChange}
    />
  );
};
