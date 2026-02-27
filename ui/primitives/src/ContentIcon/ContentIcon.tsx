import { ContentIconName, UserIcon, useIcon, useIcons } from '@minddrop/icons';
import { ContentColor } from '@minddrop/theme';
import { TextColor } from '../types/Text.types';
import { propsToClass } from '../utils';
import './ContentIcon.css';

export interface ContentIconProps {
  /**
   * The stringified icon.
   */
  icon?: string;

  /**
   * The icon used as the default icon type in case
   * the stringified icon is not present or is invalid.
   */
  defaultIcon?: UserIcon;

  /**
   * Additional class name(s) to apply to the icon.
   */
  className?: string;

  /**
   * The color of the icon. Used only if the icon does not
   * specify a color itself. Can be a ContentColor, TextColor,
   * 'inherit' to inherit the color of the surrounding text, or
   * 'content-icon' to use the color of the icon itself.
   */
  color?: ContentColor | TextColor | 'inherit' | 'content-icon';
}

export const ContentIcon: React.FC<ContentIconProps> = ({
  icon: iconString,
  color = 'content-icon',
  defaultIcon,
  className,
}) => {
  const { icon } = useIcon(iconString || '', defaultIcon);

  if (icon.type === 'emoji') {
    return (
      <span
        className={['content-icon', 'emoji', className]
          .filter(Boolean)
          .join(' ')}
        data-testid="content-icon"
      >
        {icon.icon}
      </span>
    );
  }

  return (
    <IconSetIcon
      className={className}
      name={icon.icon}
      color={color === 'content-icon' ? icon.color : color}
    />
  );
};

interface IconSetIconProps extends React.HTMLProps<SVGSVGElement> {
  /**
   * The color of the icon, matching Text colors.
   * `current-color` will use the color of the surrounding text.
   */
  color?: ContentColor | TextColor | 'current-color';

  /**
   * The name of the content icon to display.
   */
  name: ContentIconName;
}

const IconSetIcon: React.FC<IconSetIconProps> = ({
  className,
  name,
  color = 'current-color',
  ...other
}) => {
  const { ContentIcons } = useIcons();
  const IconComponent = ContentIcons[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      data-testid="content-icon"
      name={name}
      className={`icon-set-icon ${propsToClass('content-icon', { className, color })}`}
      {...other}
    />
  );
};
