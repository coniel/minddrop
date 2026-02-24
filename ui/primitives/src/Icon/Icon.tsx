import { UiIconName, useIcons } from '@minddrop/icons';
import { TextColor } from '../Text';
import { mapPropsToClasses } from '../utils';
import './Icon.css';

export interface IconProps extends React.HTMLProps<SVGSVGElement> {
  /**
   * The color of the icon, matching Text colors.
   * `current-color` will use the color of the surrounding text.
   */
  color?: TextColor | 'current-color';

  /**
   * The name of the UI icon to display.
   */
  name: UiIconName;
}

export const Icon: React.FC<IconProps> = ({
  children,
  className,
  name,
  color = 'current-color',
  ...other
}) => {
  const { UiIcon } = useIcons();

  return (
    <UiIcon
      data-testid="icon"
      className={mapPropsToClasses({ className, color }, 'icon')}
      name={name}
      {...other}
    />
  );
};
