import { ContentIconName, UserIcon, useIcon, useIcons } from '@minddrop/icons';
import { ContentColor } from '../types';
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
   * specify a color itself.
   */
  color?: ContentColor | 'inherit';
}

export const ContentIcon: React.FC<ContentIconProps> = ({
  icon: iconString,
  color = 'default',
  defaultIcon,
  className,
}) => {
  const { icon } = useIcon(iconString || '', defaultIcon);

  if (icon.type === 'emoji') {
    return (
      <span
        className={['icon content-icon', 'emoji', className]
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
      color={icon.color || color}
    />
  );
};

interface IconSetIconProps extends React.HTMLProps<SVGSVGElement> {
  /**
   * The color of the icon, matching Text colors.
   * `current-color` will use the color of the surrounding text.
   */
  color?: ContentColor | 'current-color';

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
      className={`icon icon-set-icon ${propsToClass('content-icon', { className, color })}`}
      {...other}
    />
  );
};
