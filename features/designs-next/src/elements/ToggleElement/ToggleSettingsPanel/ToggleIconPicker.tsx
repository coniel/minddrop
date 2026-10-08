import { TranslationKey } from '@minddrop/i18n';
import { ContentIcon, IconButton, IconPicker } from '@minddrop/ui-primitives';

interface ToggleIconPickerProps {
  /**
   * i18n key naming the state the icon is picked for.
   */
  label: TranslationKey;

  /**
   * The stringified icon picked, or undefined for the default.
   */
  icon?: string;

  /**
   * The stringified icon drawn when none is picked.
   */
  defaultIcon: string;

  /**
   * Callback fired with the picked icon, or undefined when it is
   * cleared.
   */
  onChange: (icon: string | undefined) => void;
}

/**
 * Renders a button opening an icon picker for one toggle state.
 */
export const ToggleIconPicker: React.FC<ToggleIconPickerProps> = ({
  label,
  icon,
  defaultIcon,
  onChange,
}) => (
  <IconPicker
    closeOnSelect
    side="right"
    align="start"
    currentIcon={icon ?? defaultIcon}
    onSelect={onChange}
    onClear={() => onChange(undefined)}
  >
    <IconButton size="sm" label={label} tooltip={{ title: label }}>
      <ContentIcon icon={icon ?? defaultIcon} />
    </IconButton>
  </IconPicker>
);
