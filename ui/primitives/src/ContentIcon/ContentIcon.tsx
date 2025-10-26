import { ContentIconName, useIcons } from '@minddrop/icons';
import { ContentColor } from '../types';
import { mapPropsToClasses } from '../utils';
import './ContentIcon.css';

export interface ContentIconProps extends React.HTMLProps<SVGSVGElement> {
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

export const ContentIcon: React.FC<ContentIconProps> = ({
  className,
  name,
  color = 'current-color',
  ...other
}) => {
  const { ContentIcons } = useIcons();
  const IconComponent = ContentIcons[name];

  return (
    <IconComponent
      data-testid="content-icon"
      name={name}
      className={mapPropsToClasses({ className, color }, 'content-icon')}
      {...other}
    />
  );
};
