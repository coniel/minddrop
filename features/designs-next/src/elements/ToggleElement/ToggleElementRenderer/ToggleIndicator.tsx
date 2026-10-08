import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Checkbox, ContentIcon, Switch } from '@minddrop/ui-primitives';
import { ToggleElementSize, ToggleStyle } from '../ToggleElement.types';

interface ToggleIndicatorProps {
  /**
   * The style the state is drawn in.
   */
  style: ToggleStyle;

  /**
   * The size the state is drawn at. The icon style takes its size
   * from the block.
   */
  size: ToggleElementSize;

  /**
   * Whether the toggle is checked.
   */
  checked: boolean;

  /**
   * The accessible name of the checkbox and switch styles.
   */
  label: string;

  /**
   * The stringified icon the icon style draws while checked.
   */
  checkedIcon: string;

  /**
   * The stringified icon the icon style draws otherwise.
   */
  uncheckedIcon: string;
}

// i18n keys of the icon style's accessible name for each state
const StateLabels: Record<'on' | 'off', TranslationKey> = {
  on: 'designsNext.elements.toggle.on',
  off: 'designsNext.elements.toggle.off',
};

/**
 * Renders a toggle's state in the element's style: a read-only
 * checkbox or switch, or the icon of the state.
 */
export const ToggleIndicator: React.FC<ToggleIndicatorProps> = ({
  style,
  size,
  checked,
  label,
  checkedIcon,
  uncheckedIcon,
}) => {
  const { t } = useTranslation();

  // Draw the checkbox style
  if (style === 'checkbox') {
    return (
      <Checkbox size={size} checked={checked} readOnly aria-label={label} />
    );
  }

  // Draw the switch style
  if (style === 'switch') {
    return <Switch size={size} checked={checked} readOnly aria-label={label} />;
  }

  // Draw the icon of the state
  return (
    <span role="img" aria-label={t(checked ? StateLabels.on : StateLabels.off)}>
      <ContentIcon icon={checked ? checkedIcon : uncheckedIcon} />
    </span>
  );
};
