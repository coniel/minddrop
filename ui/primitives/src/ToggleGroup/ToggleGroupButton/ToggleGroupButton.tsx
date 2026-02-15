import { Toggle, ToggleProps } from '@base-ui/react/toggle';
import { useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/icons';
import { Icon } from '../../Icon';
import { mapPropsToClasses } from '../../utils';
import './ToggleGroupButton.css';

export interface ToggleGroupButtonProps<TValue extends string>
  extends ToggleProps<TValue> {
  /**
   * The aria-label of the button. Can be an i18n key.
   */
  label: string;

  /**
   * The value of the button.
   */
  value: TValue;

  /**
   * The icon to display in the button.
   */
  icon?: UiIconName;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

export const ToggleGroupButton = <TValue extends string>({
  children,
  icon,
  label,
  className,
  ...other
}: ToggleGroupButtonProps<TValue>) => {
  const { t } = useTranslation();

  return (
    <Toggle
      aria-label={t(label)}
      className={mapPropsToClasses({ className }, 'toggle-group-button')}
      {...other}
    >
      {icon && <Icon name={icon} />}
      {children}
    </Toggle>
  );
};
