/* eslint-disable react/no-array-index-key */
import React, { FC, Fragment } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { BreadcrumbProps } from './Breadcrumb';
import './Breadcrumbs.css';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The crumbs.
   */
  children?:
    | React.ReactElement<BreadcrumbProps>
    | React.ReactElement<BreadcrumbProps>[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  children,
  className,
  ...other
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <nav
      aria-label="Breadcrumb"
      className={mapPropsToClasses({ className }, 'breadcrumbs')}
      {...other}
    >
      <ol className="list">
        {childrenArray.map((child, index) => (
          <Fragment key={index}>
            {child}
            {index !== childrenArray.length - 1 && (
              <span className="crumb-separator">/</span>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};
