import { UiIconName, useIcons } from '@minddrop/ui-icons';
import { TextColor } from '../Text';
import { propsToClass } from '../utils';
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

  /**
   * Degrees the icon is turned clockwise, for icons which read along
   * the wrong axis as drawn.
   */
  rotation?: number;
}

export const Icon: React.FC<IconProps> = ({
  children,
  className,
  name,
  color = 'current-color',
  rotation,
  style,
  ...other
}) => {
  const { UiIcon } = useIcons();

  // Turn the icon by its rotation, ahead of any styles given
  const iconStyle =
    rotation === undefined
      ? style
      : { transform: `rotate(${rotation}deg)`, ...style };

  return (
    <UiIcon
      data-testid="icon"
      className={propsToClass('icon', { className, color })}
      name={name}
      style={iconStyle}
      {...other}
    />
  );
};
