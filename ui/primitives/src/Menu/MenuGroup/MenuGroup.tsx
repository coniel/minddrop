import { mapPropsToClasses } from '../../utils';
import './MenuGroup.css';

export interface MenuGroupProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * Adds top margin to the group.
   */
  marginTop?: 'small' | 'medium' | 'large';

  /**
   * The group's action elements, such as buttons.
   * Rendered at the bottom of the group.
   */
  actions?: React.ReactNode;

  /**
   * When true, ations will be made visible when the group is hovered,
   * and hidden when not hovered.
   * @default false
   */
  showActionsOnHover?: boolean;

  /**
   * When true, if the group contains a MenuLabel, its actions will
   * be made visible when the group is hovered.
   * @default false
   */
  showLabelActionsOnHover?: boolean;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({
  actions,
  children,
  className,
  marginTop,
  showActionsOnHover,
  showLabelActionsOnHover,
  ...other
}) => {
  return (
    <div
      className={mapPropsToClasses(
        { className, marginTop, showActionsOnHover, showLabelActionsOnHover },
        'menu-group',
      )}
      {...other}
    >
      {children}
      <div className="actions">{actions}</div>
    </div>
  );
};
