import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Separator } from '../../Separator';

export type MenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuSeparator: FC<MenuSeparatorProps> = ({
  children,
  className,
  ...other
}) => {
  return (
    <Separator
      className={mapPropsToClasses({ className }, 'menu-label')}
      orientation="horizontal"
      margin="small"
      {...other}
    />
  );
};
