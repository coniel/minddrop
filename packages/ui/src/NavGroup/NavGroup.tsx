import React, { FC, useMemo } from 'react';
import { generateId } from '@minddrop/utils';
import { mapPropsToClasses } from '@minddrop/utils';
import './NavGroup.css';

export interface NavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the NavGroup.
   */
  children?: React.ReactNode;

  /**
   * The title of the nav group.
   */
  title?: string;

  /**
   * Accessibility label, use when not using the title prop.
   */
  label?: string;
}

export const NavGroup: FC<NavGroupProps> = ({
  children,
  className,
  title,
  label,
  ...other
}) => {
  const id = useMemo(() => generateId(), [title]);

  return (
    <nav
      aria-label={title ? undefined : label}
      aria-labelledby={title ? id : undefined}
      className={mapPropsToClasses({ className }, 'nav-group')}
      {...other}
    >
      {title && (
        <h6 id={id} className="title">
          {title}
        </h6>
      )}
      {children}
    </nav>
  );
};
