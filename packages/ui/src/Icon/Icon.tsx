import { mapPropsToClasses } from '@minddrop/utils';
import { TextColor } from '../types';
import { UiIconName, useIcons } from '@minddrop/icons';
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
  const { UiIcons } = useIcons();
  const IconComponent = UiIcons[name];

  return (
    <IconComponent
      data-testid="icon"
      className={mapPropsToClasses({ className, color }, 'icon')}
      {...other}
    />
  );
};
