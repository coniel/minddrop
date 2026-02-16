import { Toggle, ToggleProps } from '@base-ui/react/toggle';
import { useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/icons';
import { Icon } from '../../Icon';
import { Tooltip } from '../../Tooltip';
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

  /**
   * If set, a tooltip will be added to the toggle
   * using this property as its title.
   */
  tooltipTitle?: React.ReactNode;

  /**
   * If set, a tooltip will be added to the toggle
   * using this property as its description.
   */
  tooltipDescription?: React.ReactNode;
}

export const ToggleGroupButton = <TValue extends string>({
  children,
  icon,
  label,
  className,
  tooltipTitle,
  tooltipDescription,
  ...other
}: ToggleGroupButtonProps<TValue>) => {
  const { t } = useTranslation();

  const Button = (
    <Toggle
      aria-label={t(label)}
      className={mapPropsToClasses({ className }, 'toggle-group-button')}
      {...other}
    >
      {icon && <Icon name={icon} />}
      {children}
    </Toggle>
  );

  if (tooltipTitle || tooltipDescription) {
    return (
      <Tooltip title={tooltipTitle} description={tooltipDescription}>
        {Button}
      </Tooltip>
    );
  }

  return Button;
};
