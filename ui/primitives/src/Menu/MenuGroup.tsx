import React from 'react';
import { propsToClass } from '../utils';

export interface MenuGroupProps extends React.HTMLProps<HTMLDivElement> {
  /*
   * Adds top margin to the group.
   */
  marginTop?: 'small' | 'medium' | 'large';

  /*
   * When true, adds horizontal padding to the group.
   * @default false
   */
  padded?: boolean;

  /*
   * The group's action elements. Rendered at the bottom of the group.
   * Hidden by default; use showActionsOnHover to reveal on hover.
   */
  actions?: React.ReactNode;

  /*
   * When true, actions are revealed when the group is hovered.
   * @default false
   */
  showActionsOnHover?: boolean;

  /*
   * When true, if the group contains a MenuLabel, its actions are
   * revealed when the group is hovered.
   * @default false
   */
  showLabelActionsOnHover?: boolean;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({
  actions,
  children,
  className,
  marginTop,
  padded,
  showActionsOnHover,
  showLabelActionsOnHover,
  ...other
}) => (
  <div
    className={propsToClass('menu-group', {
      marginTop,
      padded,
      showActionsOnHover,
      showLabelActionsOnHover,
      className,
    })}
    {...other}
  >
    {children}
    {actions && <div className="actions">{actions}</div>}
  </div>
);
